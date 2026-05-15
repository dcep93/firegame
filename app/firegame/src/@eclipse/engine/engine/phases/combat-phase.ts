import { PhaseType } from '@data/enums';
import type { GameState, CombatState, PlayerId } from '../types';
import { appendEvent, createEvent } from '../utils/events';
import {
  determineBattles,
} from '../combat/determine-battles';
import {
  attackPopulation,
  canInfluenceSector,
  repairAllDamage,
} from '../combat/post-battle';
import {
  isNpcOwner,
} from '../combat/combat-helpers';
import {
  returnDiscFromSector,
  updateSector,
} from '../state/state-helpers';
import { findNextDiscoveryDecision } from '../actions/discovery-decision';
import { getFreeColonyShips } from '../legal-actions/legal-actions';

/**
 * Sets up combat state for step-by-step resolution.
 * If no battles, transitions directly to Upkeep.
 * Otherwise, creates CombatState and sets subPhase to halt drivePhases.
 */
export function processCombatPhase(state: GameState): GameState {
  const battles = determineBattles(state);

  if (battles.length === 0) {
    // Still run post-battle cleanup: population attack, influence, discoveries
    const afterCleanup = postBattleCleanup(state);
    if (afterCleanup.subPhase) return afterCleanup;
    return endCombatPhase(afterCleanup);
  }

  // Sort descending by sector number (determineBattles returns ascending)
  const sortedBattles = [...battles].reverse();

  const combatState: CombatState = {
    battles: sortedBattles.map(b => ({
      sectorKey: b.sectorKey,
      participants: b.participants,
    })),
    currentBattleIndex: 0,
    step: 'AWAITING_START',
    pairs: [],
    currentPairIndex: 0,
    engagementRound: 0,
    unitIndex: 0,
    pendingMissileAssignments: [],
    initialAttackerShipIds: [],
    initialDefenderShipIds: [],
    initialAttackerShips: [],
    initialDefenderShips: [],
    currentActorOwner: null,
    currentActorShipType: null,
    currentTargetOwner: null,
    bombardmentDone: false,
    retreatDecisionOfferedTo: [],
    retreatDeclaredInRound: null,
    retreatedPlayerIds: [],
    reputationProcessedPlayers: [],
  };

  return {
    ...state,
    combatState,
    subPhase: { type: 'COMBAT_STEP' },
  };
}

export function postBattleCleanup(state: GameState, skipSectors?: readonly string[]): GameState {
  // Get battle sector keys BEFORE clearing combatState
  // (battle sectors already had per-battle bombardment)
  const alreadyProcessed = new Set([
    ...(state.combatState?.battles.map(b => b.sectorKey) ?? []),
    ...(skipSectors ?? []),
  ]);

  // Clear combatState and subPhase — all battles are resolved, so the client's
  // battle panel should dismiss before sub-phase UIs (influence choice, discovery) appear.
  let result: GameState = { ...state, combatState: null, subPhase: null };

  // Step 1: Attack population in NON-BATTLE sectors only
  for (const [sectorKey] of Object.entries(result.board.sectors)) {
    if (alreadyProcessed.has(sectorKey)) continue;
    result = attackPopulation(result, sectorKey);
    // If attackPopulation created a BOMBARDMENT_CHOICE sub-phase, tag it as non-battle
    // and return early so the player can resolve it interactively
    if (result.subPhase?.type === 'BOMBARDMENT_CHOICE') {
      return {
        ...result,
        subPhase: {
          ...result.subPhase,
          isNonBattle: true,
          skipSectors: [...Array.from(alreadyProcessed), sectorKey],
        },
      };
    }
  }

  // Step 1b: Remove defender influence discs from sectors where ALL population
  // cubes are destroyed and an enemy player has ships (mandatory per rules).
  // This happens before the attacker's optional influence placement.
  result = removeDefeatedInfluenceDiscs(result);

  // Step 2: Collect eligible influence placements (interactive choice)
  const firstChoice = collectEligibleInfluences(result);
  if (firstChoice) {
    return {
      ...result,
      subPhase: {
        type: 'INFLUENCE_SECTOR_CHOICE',
        playerId: firstChoice.playerId,
        eligibleSectors: firstChoice.sectorKeys,
        offeredPlayerIds: [],
      },
    };
  }

  // Step 3: No influence choices needed, proceed to repair + discoveries
  return finishPostBattleCleanup(result);
}

/**
 * Remove influence discs from sectors where all population cubes are destroyed
 * and an enemy player has ships present. Per rules: "if you have at least one
 * Ship in a Sector that has no Population Cubes, remove the Controlling player's
 * Influence Disc and place it on their Influence Track."
 */
export function removeDefeatedInfluenceDiscs(state: GameState): GameState {
  let result = state;

  for (const [sectorKey, sector] of Object.entries(result.board.sectors)) {
    if (!sector.influenceDisc) continue;
    if (sector.populations.length > 0) continue;
    if (sector.structures.orbitalPopulation) continue;

    // Check if an enemy (non-NPC) player has ships in this sector
    const owner = sector.influenceDisc;
    const hasEnemyShips = sector.ships.some(
      s => !isNpcOwner(s.owner) && s.owner !== owner,
    );
    if (!hasEnemyShips) continue;

    // Remove the defender's disc
    result = returnDiscFromSector(result, owner);
    result = updateSector(result, sectorKey, { influenceDisc: null });
  }

  return result;
}

/**
 * Collect all (sectorKey, playerId) pairs where a player can influence a sector
 * after combat. Returns the first player (in turn order) with eligible sectors,
 * or null if none.
 */
export function collectEligibleInfluences(
  state: GameState,
  skipPlayerIds?: readonly PlayerId[],
): { playerId: PlayerId; sectorKeys: string[] } | null {
  const skipSet = new Set(skipPlayerIds ?? []);

  // Gather all eligible pairs grouped by player
  const byPlayer = new Map<string, string[]>();

  for (const [sectorKey, sector] of Object.entries(state.board.sectors)) {
    for (const ship of sector.ships) {
      if (isNpcOwner(ship.owner)) continue;
      const playerId = ship.owner as PlayerId;
      if (sector.influenceDisc === playerId) continue;
      if (!canInfluenceSector(state, sectorKey, playerId)) continue;

      if (!byPlayer.has(playerId)) {
        byPlayer.set(playerId, []);
      }
      if (!byPlayer.get(playerId)!.includes(sectorKey)) {
        byPlayer.get(playerId)!.push(sectorKey);
      }
    }
  }

  // Return first player in turn order with eligible sectors
  for (const playerId of state.turnOrder) {
    if (skipSet.has(playerId as PlayerId)) continue;
    const sectorKeys = byPlayer.get(playerId);
    if (sectorKeys && sectorKeys.length > 0) {
      return { playerId, sectorKeys };
    }
  }

  return null;
}

/**
 * After all influence choices are resolved, repair damage and check for discoveries.
 */
export function finishPostBattleCleanup(state: GameState): GameState {
  let result = state;

  // Repair all damage
  result = repairAllDamage(result);

  // Check for discovery decisions (replaces auto-claim)
  // Per rules: "if you have at least one Ship in a Sector with a Discovery Tile, take the tile"
  // Also covers sectors the player controls via influence disc.
  for (const sector of Object.values(result.board.sectors)) {
    if (!sector.discoveryTile) continue;
    if (sector.ancients > 0) continue;

    // Find the player eligible for this discovery: influence disc owner or ship owner
    let eligiblePlayer: PlayerId | null = null;
    if (sector.influenceDisc && !isNpcOwner(sector.influenceDisc)) {
      eligiblePlayer = sector.influenceDisc as PlayerId;
    } else {
      for (const ship of sector.ships) {
        if (!isNpcOwner(ship.owner)) {
          eligiblePlayer = ship.owner as PlayerId;
          break;
        }
      }
    }

    if (!eligiblePlayer) continue;

    const discoveryTarget = findNextDiscoveryDecision(result, eligiblePlayer);
    if (discoveryTarget) {
      result = {
        ...result,
        subPhase: {
          type: 'DISCOVERY_DECISION',
          playerId: eligiblePlayer,
          tileId: discoveryTarget.tileId,
          sectorKey: discoveryTarget.sectorKey,
        },
      };
      return result;
    }
  }

  // Check for colony ship placement window before ending combat
  return checkPostCombatColonyShips(result);
}

/**
 * Check if any player has colony ships + valid placements after combat.
 * Returns state with COLONY_SHIP_PLACEMENT sub-phase for the first eligible
 * player in turn order, or the unchanged state if none.
 */
export function checkPostCombatColonyShips(state: GameState): GameState {
  for (const playerId of state.turnOrder) {
    const player = state.players[playerId]!;
    if (player.eliminated) continue;
    if (player.colonyShips.available <= 0) continue;

    const placements = getFreeColonyShips(state, playerId as PlayerId);
    if (placements.length > 0) {
      return {
        ...state,
        subPhase: { type: 'COLONY_SHIP_PLACEMENT', playerId: playerId as PlayerId, offeredPlayerIds: [] },
      };
    }
  }
  return state;
}

/**
 * After a colony ship action or pass during COLONY_SHIP_PLACEMENT,
 * find the next eligible player or end combat.
 * @param skipCurrentPlayer - true when the current player passed (skip them entirely)
 */
export function advanceColonyShipPlacement(state: GameState, skipCurrentPlayer: boolean): GameState {
  const subPhase = state.subPhase?.type === 'COLONY_SHIP_PLACEMENT' ? state.subPhase : null;
  const currentPlayerId = subPhase?.playerId ?? null;
  const offeredPlayerIds = subPhase?.offeredPlayerIds ?? [];

  if (!skipCurrentPlayer && currentPlayerId) {
    const placements = getFreeColonyShips(state, currentPlayerId);
    if (placements.length > 0) {
      return state; // Current player still has valid placements
    }
  }

  // Mark current player as offered (they either used all ships or passed)
  const newOffered = currentPlayerId
    ? [...offeredPlayerIds, currentPlayerId]
    : offeredPlayerIds;
  const offeredSet = new Set(newOffered);

  // Find next eligible player in turn order who hasn't been offered yet
  for (const playerId of state.turnOrder) {
    if (offeredSet.has(playerId as PlayerId)) continue;

    const player = state.players[playerId]!;
    if (player.eliminated) continue;
    if (player.colonyShips.available <= 0) continue;

    const placements = getFreeColonyShips(state, playerId as PlayerId);
    if (placements.length > 0) {
      return {
        ...state,
        subPhase: { type: 'COLONY_SHIP_PLACEMENT', playerId: playerId as PlayerId, offeredPlayerIds: newOffered },
      };
    }
  }

  // No more eligible players — end combat
  return endCombatPhase({ ...state, subPhase: null });
}

export function endCombatPhase(state: GameState): GameState {
  const event = createEvent('PHASE_CHANGED', {
    from: PhaseType.Combat,
    to: PhaseType.Upkeep,
    round: state.round,
  });

  return {
    ...state,
    phase: PhaseType.Upkeep,
    combatState: null,
    subPhase: null,
    eventLog: appendEvent(state.eventLog, event),
  };
}
