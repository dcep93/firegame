import { DICE_DAMAGE } from '@data/constants';
import { PhaseType, NpcType as NpcTypeValue } from '@data/enums';
import type { NpcType, ShipType } from '@data/enums';
import type {
  GameState,
  PlayerId,
} from '../types';
import { appendEvent, createEvent } from '../utils/events';
import { determineBattlePairs } from '../combat/determine-battles';
import { calculateInitiativeOrder } from '../combat/initiative';
import type { CombatUnit } from '../combat/initiative';
import { rollMissileDice } from '../combat/missile-phase';
import { rollAttackDice, isBattleOver } from '../combat/engagement';
import { isStalemate } from '../combat/stalemate';
import { getHits, isHit } from '../combat/hit-determination';
import type { RollResult } from '../combat/hit-determination';
import { applyDamage } from '../combat/damage';
import { npcAssignDamage, expandAntimatterHits } from '../combat/npc-ai';
import { playerHasTech } from '../state/state-queries';
import {
  calculateReputationDrawCount,
  drawReputationTiles,
  getMaxReputationSlots,
} from '../combat/reputation';
import { postBattleCleanup, endCombatPhase, removeDefeatedInfluenceDiscs } from '../phases/combat-phase';
import { performPerBattleBombardment } from '../combat/post-battle';
import {
  getActiveShipsInSector,
  getShipCombatStats,
  isNpcOwner,
  getOwnerShipsInSector,
  isDescendantsOfDraco,
} from '../combat/combat-helpers';
import {
  completeAllPendingRetreats,
  getValidRetreatTargets,
} from '../combat/retreat';

// ── Actor Info Helper ──

/**
 * Computes who fires next at a given unitIndex for a given phase.
 * Returns null if no unit exists at that index.
 */
function getActorInfo(
  state: GameState,
  sectorKey: string,
  attacker: PlayerId | NpcType,
  defender: PlayerId | NpcType,
  unitIndex: number,
  phase: 'missile' | 'engagement',
): { owner: string; shipType: ShipType; target: string } | null {
  const initOrder = calculateInitiativeOrder(state, sectorKey, attacker, defender);

  if (phase === 'missile') {
    const missileUnits = initOrder.filter(unit => {
      const stats = getShipCombatStats(unit.ships[0]!, state);
      return stats.missiles.length > 0;
    });
    const unit = missileUnits[unitIndex];
    if (!unit) return null;
    const target = unit.owner === attacker ? defender : attacker;
    return { owner: String(unit.owner), shipType: unit.shipType, target: String(target) };
  }

  // Engagement: filter to units with active ships and weapons
  let effectiveIndex = 0;
  for (const unit of initOrder) {
    const active = getActiveShipsInSector(state, sectorKey, unit.owner);
    if (active.length === 0) continue;
    const unitStats = getShipCombatStats(unit.ships[0]!, state);
    if (unitStats.weapons.length === 0) continue;
    if (effectiveIndex === unitIndex) {
      const target = unit.owner === attacker ? defender : attacker;
      return { owner: String(unit.owner), shipType: unit.shipType, target: String(target) };
    }
    effectiveIndex++;
  }
  return null;
}

const CLEARED_ACTOR = {
  currentActorOwner: null,
  currentActorShipType: null,
  currentTargetOwner: null,
} as const;

function actorFields(info: { owner: string; shipType: ShipType; target: string } | null) {
  if (!info) return CLEARED_ACTOR;
  return {
    currentActorOwner: info.owner,
    currentActorShipType: info.shipType as string,
    currentTargetOwner: info.target,
  };
}

// ── Validation ──

export function validateCombatStep(
  state: GameState,
  playerId: PlayerId,
): string | null {
  if (state.phase !== PhaseType.Combat) return 'Not in combat phase';
  if (!state.combatState) return 'No active combat';
  if (state.combatState.step === 'ALL_COMPLETE') return 'Combat already complete';

  // During firing steps, only the current actor (or the human opponent of an NPC) can advance
  // When currentActorOwner is null (unit destroyed), any battle participant can advance
  const cs = state.combatState;
  const isFiringStep = cs.step === 'MISSILE_FIRE' || cs.step === 'ENGAGEMENT_FIRE';
  if (isFiringStep) {
    if (cs.currentActorOwner === null) {
      // No actor at this index (ships destroyed) — any human in the pair may advance
      const pair = cs.pairs[cs.currentPairIndex];
      if (pair && pair.attacker !== playerId && pair.defender !== playerId) {
        return 'Not a participant in this battle';
      }
    } else if (isNpcOwner(cs.currentActorOwner as any)) {
      // NPC turn: the human player in this battle pair may advance
      const pair = cs.pairs[cs.currentPairIndex];
      if (pair && pair.attacker !== playerId && pair.defender !== playerId) {
        return 'Not your turn — NPC is fighting a different player';
      }
    } else if (cs.currentActorOwner !== playerId) {
      return 'Not your turn to fire';
    }
  }
  return null;
}

export function executeCombatStep(
  state: GameState,
  _playerId: PlayerId,
): GameState {
  const cs = state.combatState!;
  switch (cs.step) {
    case 'AWAITING_START':
      return executeStartBattle(state);
    case 'MISSILE_FIRE':
      return executeMissileFire(state);
    case 'ENGAGEMENT_FIRE':
      return executeEngagementFire(state);
    case 'BATTLE_RESULT':
      return advanceToNextBattleOrComplete(state);
    case 'POST_BATTLE':
      return executePostBattle(state);
    default:
      return state;
  }
}

// ── AWAITING_START ──

function executeStartBattle(state: GameState): GameState {
  const cs = state.combatState!;
  const battle = cs.battles[cs.currentBattleIndex]!;
  const sector = state.board.sectors[battle.sectorKey]!;

  // Log BATTLE_STARTED event
  let result: GameState = {
    ...state,
    eventLog: appendEvent(
      state.eventLog,
      createEvent('BATTLE_STARTED', {
        sector: sector.position,
        participants: battle.participants,
      }),
    ),
  };

  // Determine battle pairs
  const pairs = determineBattlePairs(result, battle.sectorKey, battle.participants);

  if (pairs.length === 0) {
    // No valid pairs, skip to next battle or complete
    return advanceToNextBattleOrComplete(result);
  }

  const firstPair = pairs[0]!;

  // Draco coexists with ancients — skip if first pair is Draco-vs-Ancient
  if (isDracoVsAncientPair(result, firstPair.attacker, firstPair.defender)) {
    return advancePairOrBattle(result, pairs, 0);
  }

  // Check if either side still has ships for this pair
  const attackerShips = getActiveShipsInSector(result, battle.sectorKey, firstPair.attacker);
  const defenderShips = getActiveShipsInSector(result, battle.sectorKey, firstPair.defender);

  if (attackerShips.length === 0 || defenderShips.length === 0) {
    // Skip to next pair or complete
    return advancePairOrBattle(result, pairs, 0);
  }

  // Record initial ships for reputation calculation
  const initialAttackerShips = getOwnerShipsInSector(
    result, battle.sectorKey, firstPair.attacker,
  );
  const initialDefenderShips = getOwnerShipsInSector(
    result, battle.sectorKey, firstPair.defender,
  );
  const initialAttackerShipIds = initialAttackerShips.map(s => s.id);
  const initialDefenderShipIds = initialDefenderShips.map(s => s.id);

  // Calculate initiative order to check for missiles
  const initOrder = calculateInitiativeOrder(
    result, battle.sectorKey, firstPair.attacker, firstPair.defender,
  );

  const hasMissiles = initOrder.some(unit => {
    const stats = getShipCombatStats(unit.ships[0]!, result);
    return stats.missiles.length > 0;
  });

  const nextStep = hasMissiles ? 'MISSILE_FIRE' as const : 'ENGAGEMENT_FIRE' as const;
  const nextPhase = hasMissiles ? 'missile' as const : 'engagement' as const;
  const nextActor = getActorInfo(result, battle.sectorKey, firstPair.attacker, firstPair.defender, 0, nextPhase);

  return {
    ...result,
    combatState: {
      ...cs,
      pairs,
      currentPairIndex: 0,
      step: nextStep,
      unitIndex: 0,
      engagementRound: nextStep === 'ENGAGEMENT_FIRE' ? 1 : 0,
      pendingMissileAssignments: [],
      initialAttackerShipIds,
      initialDefenderShipIds,
      initialAttackerShips,
      initialDefenderShips,
      ...actorFields(nextActor),
      retreatDecisionOfferedTo: [],
      retreatDeclaredInRound: null,
      retreatedPlayerIds: [],
      reputationProcessedPlayers: [],
    },
  };
}

// ── Manual Damage Assignment Helpers ──

/**
 * Build a DAMAGE_ASSIGNMENT sub-phase for manual hit assignment.
 * Expands Antimatter Splitter hits for engagement (not missiles).
 */
function buildDamageAssignmentSubPhase(
  state: GameState,
  sectorKey: string,
  hits: readonly RollResult[],
  targetShips: readonly import('../types').ShipOnBoard[],
  attackerOwner: string,
  isMissile: boolean,
): GameState {
  // For engagement, expand Antimatter Splitter hits (red → 4×yellow)
  let effectiveHits = hits;
  if (!isMissile && !isNpcOwner(attackerOwner as any)) {
    const player = state.players[attackerOwner as PlayerId];
    if (player && playerHasTech(player, 'antimatter_splitter')) {
      effectiveHits = expandAntimatterHits(hits);
    }
  }

  const subPhaseHits = effectiveHits.map(h => ({
    dieColor: String(h.dieColor),
    faceIndex: h.faceIndex,
    faceValue: h.faceValue,
    isBurst: h.isBurst,
    isMiss: h.isMiss,
    damage: DICE_DAMAGE[h.dieColor],
  }));

  const subPhaseShips = targetShips.map(s => ({
    shipId: s.id,
    shipType: String(s.type),
    damage: s.damage,
    hullValue: getShipCombatStats(s, state).hullValue,
  }));

  // Determine defending player (the one who assigns damage to their own ships)
  const targetOwner = targetShips[0]?.owner;
  const defenderId = targetOwner && !isNpcOwner(targetOwner)
    ? String(targetOwner) : '';

  return {
    ...state,
    subPhase: {
      type: 'DAMAGE_ASSIGNMENT',
      playerId: defenderId,
      sectorKey,
      hits: subPhaseHits,
      targetShips: subPhaseShips,
      attackerOwner,
      isMissile,
    },
  };
}

/**
 * Called after damage is applied (either manually or auto-assigned)
 * to continue combat — checks battle over, advances unitIndex, etc.
 */
export function continueAfterDamage(
  state: GameState,
  phase: 'missile' | 'engagement',
): GameState {
  const cs = state.combatState!;
  const battle = cs.battles[cs.currentBattleIndex]!;
  const pair = cs.pairs[cs.currentPairIndex]!;

  // Check if battle is over after damage
  if (isBattleOver(state, battle.sectorKey, pair.attacker, pair.defender)) {
    return processReputationAndAdvancePair(state);
  }

  if (phase === 'missile') {
    // Advance to next missile unit
    const nextActor = getActorInfo(state, battle.sectorKey, pair.attacker, pair.defender, cs.unitIndex + 1, 'missile');
    if (!nextActor) {
      return advanceFromMissilesToEngagement(state);
    }
    return {
      ...state,
      combatState: {
        ...cs,
        unitIndex: cs.unitIndex + 1,
        pendingMissileAssignments: [],
        ...actorFields(nextActor),
      },
    };
  }

  // Engagement: advance to next unit or end round
  const nextActor = getActorInfo(state, battle.sectorKey, pair.attacker, pair.defender, cs.unitIndex + 1, 'engagement');
  if (!nextActor) {
    return handleEngagementRoundEnd(state);
  }
  return {
    ...state,
    combatState: {
      ...cs,
      unitIndex: cs.unitIndex + 1,
      ...actorFields(nextActor),
    },
  };
}

// ── MISSILE_FIRE ──

function executeMissileFire(state: GameState): GameState {
  const cs = state.combatState!;
  const battle = cs.battles[cs.currentBattleIndex]!;
  const pair = cs.pairs[cs.currentPairIndex]!;

  // Calculate initiative order
  const initOrder = calculateInitiativeOrder(
    state, battle.sectorKey, pair.attacker, pair.defender,
  );

  // Find the unitIndex-th unit that has missiles AND still has active ships
  let missileUnitCount = 0;
  let currentUnit: CombatUnit | undefined;
  for (const unit of initOrder) {
    const active = getActiveShipsInSector(state, battle.sectorKey, unit.owner);
    if (active.length === 0) continue;
    const unitStats = getShipCombatStats(unit.ships[0]!, state);
    if (unitStats.missiles.length === 0) continue;
    if (missileUnitCount === cs.unitIndex) {
      currentUnit = unit;
      break;
    }
    missileUnitCount++;
  }

  if (!currentUnit) {
    // No more missile units — advance to engagement phase
    return advanceFromMissilesToEngagement(state);
  }

  // Roll missiles for this unit
  const stats = getShipCombatStats(currentUnit.ships[0]!, state);
  const { rollsByUnit, state: afterRoll } = rollMissileDice(
    state,
    battle.sectorKey,
    [currentUnit],
  );

  let result = afterRoll;
  const rolls = rollsByUnit.get(0) ?? [];

  if (rolls.length > 0) {
    const targetOwner = currentUnit.owner === pair.attacker ? pair.defender : pair.attacker;
    const targetShips = getActiveShipsInSector(result, battle.sectorKey, targetOwner);
    const tShield = targetShips.length > 0
      ? getShipCombatStats(targetShips[0]!, result).shieldValue : 0;

    // Emit DICE_ROLLED event
    const diceResults = rolls.map(r => ({
      color: r.dieColor,
      face: r.faceValue,
      isHit: isHit(r, stats.computerValue, tShield),
    }));
    result = {
      ...result,
      eventLog: appendEvent(result.eventLog, createEvent('DICE_ROLLED', {
        roller: currentUnit.owner,
        shipType: currentUnit.shipType,
        dice: diceResults,
        purpose: 'missiles',
      })),
    };

    // Apply damage immediately — destroyed ships won't fire in later steps
    const filteredHits = getHits(rolls, stats.computerValue, tShield);
    if (filteredHits.length > 0 && targetShips.length > 0) {
      // Manual damage assignment: pause for human defender to assign
      if (state.config.manualDamageAssignment && !isNpcOwner(targetOwner)) {
        return buildDamageAssignmentSubPhase(
          result, battle.sectorKey, filteredHits, targetShips,
          String(currentUnit.owner), true,
        );
      }
      const assignments = npcAssignDamage(filteredHits, targetShips, result, currentUnit.owner, true);
      result = applyDamage(result, battle.sectorKey, assignments, currentUnit.owner);
    }
  }

  return continueAfterDamage(result, 'missile');
}

function advanceFromMissilesToEngagement(state: GameState): GameState {
  const cs = state.combatState!;
  const battle = cs.battles[cs.currentBattleIndex]!;
  const pair = cs.pairs[cs.currentPairIndex]!;

  // Check if battle is already over after missiles
  if (isBattleOver(state, battle.sectorKey, pair.attacker, pair.defender)) {
    return processReputationAndAdvancePair(state);
  }

  // Set actor for first engagement unit
  const nextActor = getActorInfo(state, battle.sectorKey, pair.attacker, pair.defender, 0, 'engagement');

  // Advance to engagement phase
  return {
    ...state,
    combatState: {
      ...cs,
      step: 'ENGAGEMENT_FIRE',
      unitIndex: 0,
      engagementRound: 1,
      pendingMissileAssignments: [],
      ...actorFields(nextActor),
    },
  };
}

// ── ENGAGEMENT_FIRE ──

function executeEngagementFire(state: GameState): GameState {
  const cs = state.combatState!;
  const battle = cs.battles[cs.currentBattleIndex]!;
  const pair = cs.pairs[cs.currentPairIndex]!;

  // Check for battle over or stalemate
  if (isBattleOver(state, battle.sectorKey, pair.attacker, pair.defender)) {
    return processReputationAndAdvancePair(state);
  }
  if (isStalemate(state, battle.sectorKey, pair.attacker, pair.defender)) {
    return processReputationAndAdvancePair(state);
  }

  // ── Start-of-round retreat decisions ──
  // Offer retreat before ANY unit fires each round (including round 1).
  // buildRetreatSubPhase returns null once all players have been offered.
  if (cs.unitIndex === 0) {
    const retreatSubPhase = buildRetreatSubPhase(state, battle.sectorKey, pair, cs.retreatDecisionOfferedTo);
    if (retreatSubPhase) {
      return { ...state, subPhase: retreatSubPhase };
    }
  }

  // Recalculate initiative order (ships may have been destroyed).
  // NOTE: calculateInitiativeOrder uses getActiveShipsInSector which excludes
  // retreating ships, so all units here contain only non-retreating ships.
  const initOrder = calculateInitiativeOrder(
    state, battle.sectorKey, pair.attacker, pair.defender,
  );

  // Find the unit at unitIndex that has active ships with weapons
  let currentUnit: CombatUnit | undefined;
  let effectiveIndex = 0;
  for (const unit of initOrder) {
    const active = getActiveShipsInSector(state, battle.sectorKey, unit.owner);
    if (active.length === 0) continue;
    const unitStats = getShipCombatStats(unit.ships[0]!, state);
    if (unitStats.weapons.length === 0) continue;
    if (effectiveIndex === cs.unitIndex) {
      currentUnit = unit;
      break;
    }
    effectiveIndex++;
  }

  if (!currentUnit) {
    // All units done this round — state unchanged since top checks
    return handleEngagementRoundEnd(state);
  }

  // Roll attack dice for this unit
  const { rolls, state: afterRoll } = rollAttackDice(
    state, battle.sectorKey, currentUnit,
  );
  let result = afterRoll;

  // Determine target — retreating ships ARE still targetable until they escape
  const targetOwner = currentUnit.owner === pair.attacker ? pair.defender : pair.attacker;
  const targetShips = getOwnerShipsInSector(result, battle.sectorKey, targetOwner);

  if (rolls.length > 0) {
    const stats = getShipCombatStats(currentUnit.ships[0]!, result);
    const targetShield = targetShips.length > 0
      ? getShipCombatStats(targetShips[0]!, result).shieldValue : 0;

    // Emit DICE_ROLLED event
    const diceResults = rolls.map(r => ({
      color: r.dieColor,
      face: r.faceValue,
      isHit: isHit(r, stats.computerValue, targetShield),
    }));
    result = {
      ...result,
      eventLog: appendEvent(result.eventLog, createEvent('DICE_ROLLED', {
        roller: currentUnit.owner,
        shipType: currentUnit.shipType,
        dice: diceResults,
        purpose: `engagement_round_${cs.engagementRound}`,
      })),
    };

    // Filter hits and apply damage immediately
    const filteredHits = getHits(rolls, stats.computerValue, targetShield);
    if (filteredHits.length > 0 && targetShips.length > 0) {
      // Manual damage assignment: pause for human defender to assign
      if (state.config.manualDamageAssignment && !isNpcOwner(targetOwner)) {
        return buildDamageAssignmentSubPhase(
          result, battle.sectorKey, filteredHits, targetShips,
          String(currentUnit.owner), false,
        );
      }
      const assignments = npcAssignDamage(filteredHits, targetShips, result, currentUnit.owner, false);
      result = applyDamage(result, battle.sectorKey, assignments, currentUnit.owner);
    }
  }

  return continueAfterDamage(result, 'engagement');
}

/**
 * Handles the end of an engagement round: completes pending retreats,
 * checks termination conditions, and starts the next round.
 */
function handleEngagementRoundEnd(state: GameState): GameState {
  let cs = state.combatState!;
  const battle = cs.battles[cs.currentBattleIndex]!;
  const pair = cs.pairs[cs.currentPairIndex]!;

  // Complete retreats after the fire round where retreat was declared.
  // Retreat declared at start of round N → ships targetable in round N → escape at end of round N.
  if (cs.retreatDeclaredInRound !== null && cs.engagementRound >= cs.retreatDeclaredInRound) {
    let retreatResult: GameState = state;
    for (const participant of [pair.attacker, pair.defender]) {
      if (isNpcOwner(participant)) continue;
      retreatResult = completeAllPendingRetreats(retreatResult, participant as string, battle.sectorKey);
    }
    if (isBattleOver(retreatResult, battle.sectorKey, pair.attacker, pair.defender)) {
      return processReputationAndAdvancePair(retreatResult);
    }
    state = retreatResult;
    cs = state.combatState!;
    state = {
      ...state,
      combatState: { ...cs, retreatDeclaredInRound: null, retreatDecisionOfferedTo: [] },
    };
    cs = state.combatState!;
  }

  // Check termination before starting next round (handles post-damage/post-retreat stalemate)
  if (isBattleOver(state, battle.sectorKey, pair.attacker, pair.defender)) {
    return processReputationAndAdvancePair(state);
  }
  if (isStalemate(state, battle.sectorKey, pair.attacker, pair.defender)) {
    return processReputationAndAdvancePair(state);
  }

  // Start next round (retreat decisions will be offered at unitIndex === 0 on re-entry)
  const nextActor = getActorInfo(state, battle.sectorKey, pair.attacker, pair.defender, 0, 'engagement');
  return {
    ...state,
    combatState: {
      ...cs,
      engagementRound: cs.engagementRound + 1,
      unitIndex: 0,
      retreatDecisionOfferedTo: [],
      ...actorFields(nextActor),
    },
  };
}

// ── Retreat Sub-Phase Builder ──

/**
 * At round boundaries, find the next eligible player for a retreat decision.
 * Returns a RETREAT_DECISION sub-phase or null if no one can/needs to retreat.
 */
function buildRetreatSubPhase(
  state: GameState,
  sectorKey: string,
  pair: { attacker: PlayerId | NpcType; defender: PlayerId | NpcType },
  alreadyOffered: readonly string[],
): GameState['subPhase'] {
  for (const participant of [pair.attacker, pair.defender]) {
    if (isNpcOwner(participant)) continue;
    const playerId = participant as string;
    if (alreadyOffered.includes(playerId)) continue;

    const validTargets = getValidRetreatTargets(state, playerId, sectorKey);
    if (validTargets.length === 0) continue;

    const sector = state.board.sectors[sectorKey];
    const playerShips = sector
      ? sector.ships
          .filter(s => s.owner === playerId && !s.isRetreating)
          .map(s => ({
            shipId: s.id,
            shipType: String(s.type),
            damage: s.damage,
            hullValue: getShipCombatStats(s, state).hullValue,
          }))
      : [];

    if (playerShips.length === 0) continue;

    return {
      type: 'RETREAT_DECISION',
      playerId,
      sectorKey,
      validTargets,
      playerShips,
    };
  }
  return null;
}

// ── POST_BATTLE ──

function executePostBattle(state: GameState): GameState {
  let result = postBattleCleanup(state);

  // If postBattleCleanup set an interactive sub-phase, halt here —
  // the combat phase will continue after the player resolves it.
  if (result.subPhase) {
    return result;
  }

  // Clear combat state and transition
  return endCombatPhase(result);
}

// ── Reputation & Pair/Battle Advancement ──

function processReputationAndAdvancePair(state: GameState): GameState {
  // Reset processed players list for this pair
  let result = {
    ...state,
    combatState: {
      ...state.combatState!,
      reputationProcessedPlayers: [],
    },
  };

  return continueReputationProcessing(result);
}

/**
 * Continue processing reputation draws for remaining unprocessed participants.
 * Called initially from processReputationAndAdvancePair and then after each
 * REPUTATION_SELECTION action.
 */
export function continueReputationProcessing(state: GameState): GameState {
  const cs = state.combatState!;
  const battle = cs.battles[cs.currentBattleIndex]!;
  const pair = cs.pairs[cs.currentPairIndex]!;
  let result = state;

  const participants = [pair.attacker, pair.defender];

  for (const participant of participants) {
    if (isNpcOwner(participant)) continue;

    const playerId = participant as PlayerId;

    // Skip already-processed players
    if (cs.reputationProcessedPlayers.includes(playerId)) continue;

    const enemySide = participant === pair.attacker ? pair.defender : pair.attacker;
    // Use stored initial ships (not sector lookup — destroyed ships are already removed)
    const enemyInitialShips = participant === pair.attacker
      ? cs.initialDefenderShips : cs.initialAttackerShips;

    const remainingEnemyIds = new Set(
      getOwnerShipsInSector(result, battle.sectorKey, enemySide).map(s => s.id),
    );

    const destroyedShips = enemyInitialShips.filter(s => !remainingEnemyIds.has(s.id));

    // Per rules: "If all of your remaining Ships attempt to Retreat, you do not
    // draw a Reputation Tile for participating in the battle" — only actual retreat
    // forfeits the +1 base. Ships being destroyed does NOT forfeit it.
    const allRetreated = cs.retreatedPlayerIds.includes(playerId);

    const maxSlots = getMaxReputationSlots(result, playerId);
    const drawCount = calculateReputationDrawCount(destroyedShips, allRetreated, maxSlots);
    if (drawCount <= 0) {
      // Mark as processed and continue
      result = {
        ...result,
        combatState: {
          ...result.combatState!,
          reputationProcessedPlayers: [...result.combatState!.reputationProcessedPlayers, playerId],
        },
      };
      continue;
    }

    const { drawn, state: afterDraw } = drawReputationTiles(result, drawCount);
    result = afterDraw;

    if (drawn.length > 0) {
      // Set REPUTATION_SELECTION sub-phase for interactive player choice
      result = {
        ...result,
        subPhase: {
          type: 'REPUTATION_SELECTION',
          playerId,
          drawn,
        },
        combatState: {
          ...result.combatState!,
          reputationProcessedPlayers: [...result.combatState!.reputationProcessedPlayers, playerId],
        },
      };
      // Return — wait for player's REPUTATION_SELECTION action
      return result;
    }

    // No tiles drawn (empty bag) — mark processed
    result = {
      ...result,
      combatState: {
        ...result.combatState!,
        reputationProcessedPlayers: [...result.combatState!.reputationProcessedPlayers, playerId],
      },
    };
  }

  // All participants processed — advance to next pair/battle
  return advancePairOrBattle(result, cs.pairs, cs.currentPairIndex);
}

function advancePairOrBattle(
  state: GameState,
  pairs: readonly { attacker: PlayerId | NpcType; defender: PlayerId | NpcType }[],
  currentPairIndex: number,
): GameState {
  const cs = state.combatState!;
  const battle = cs.battles[cs.currentBattleIndex]!;
  const nextPairIndex = currentPairIndex + 1;

  if (nextPairIndex < pairs.length) {
    let nextPair = pairs[nextPairIndex]!;
    let effectivePairs = pairs;

    // Check if either side has ships
    let attackerShips = getActiveShipsInSector(state, battle.sectorKey, nextPair.attacker);
    const defenderShips = getActiveShipsInSector(state, battle.sectorKey, nextPair.defender);

    // Bracket-style multi-party combat: if the designated attacker was
    // eliminated in a prior engagement, the actual winner takes their place.
    // E.g., bracket [D,C,B,A] → pairs [D vs C, C vs B, B vs A].
    // If D beats C, pair "C vs B" should become "D vs B", not be skipped.
    if (attackerShips.length === 0 && defenderShips.length > 0) {
      const winner = findBracketWinner(state, battle.sectorKey, pairs, nextPairIndex);
      if (winner && winner !== nextPair.defender) {
        nextPair = { attacker: winner, defender: nextPair.defender };
        attackerShips = getActiveShipsInSector(state, battle.sectorKey, winner);
        // Update pairs so subsequent combat steps reference the correct participants
        const mutablePairs = [...pairs];
        mutablePairs[nextPairIndex] = nextPair;
        effectivePairs = mutablePairs;
      }
    }

    // NPCs don't fight each other — skip NPC vs NPC pairs
    if (isNpcOwner(nextPair.attacker) && isNpcOwner(nextPair.defender)) {
      return advancePairOrBattle(state, effectivePairs, nextPairIndex);
    }

    // Draco coexists with ancients — skip Draco-vs-Ancient pairs
    if (isDracoVsAncientPair(state, nextPair.attacker, nextPair.defender)) {
      return advancePairOrBattle(state, effectivePairs, nextPairIndex);
    }

    if (attackerShips.length === 0 || defenderShips.length === 0) {
      return advancePairOrBattle(state, effectivePairs, nextPairIndex);
    }

    const initialAttackerShips = getOwnerShipsInSector(
      state, battle.sectorKey, nextPair.attacker,
    );
    const initialDefenderShips = getOwnerShipsInSector(
      state, battle.sectorKey, nextPair.defender,
    );
    const initialAttackerShipIds = initialAttackerShips.map(s => s.id);
    const initialDefenderShipIds = initialDefenderShips.map(s => s.id);

    const initOrder = calculateInitiativeOrder(
      state, battle.sectorKey, nextPair.attacker, nextPair.defender,
    );

    const hasMissiles = initOrder.some(unit => {
      const stats = getShipCombatStats(unit.ships[0]!, state);
      return stats.missiles.length > 0;
    });

    const nextStep = hasMissiles ? 'MISSILE_FIRE' as const : 'ENGAGEMENT_FIRE' as const;
    const nextPhase = hasMissiles ? 'missile' as const : 'engagement' as const;
    const nextActor = getActorInfo(state, battle.sectorKey, nextPair.attacker, nextPair.defender, 0, nextPhase);

    return {
      ...state,
      combatState: {
        ...cs,
        pairs: effectivePairs,
        currentPairIndex: nextPairIndex,
        step: nextStep,
        unitIndex: 0,
        engagementRound: nextStep === 'ENGAGEMENT_FIRE' ? 1 : 0,
        pendingMissileAssignments: [],
        initialAttackerShipIds,
        initialDefenderShipIds,
        initialAttackerShips,
        initialDefenderShips,
        ...actorFields(nextActor),
        retreatDecisionOfferedTo: [],
        retreatDeclaredInRound: null,
        retreatedPlayerIds: [],
        reputationProcessedPlayers: [],
      },
    };
  }

  // All pairs in this battle done — pause at BATTLE_RESULT so the client
  // can show dice animation + victory banner before advancing
  return {
    ...state,
    combatState: {
      ...cs,
      step: 'BATTLE_RESULT',
      ...CLEARED_ACTOR,
    },
  };
}

/**
 * Walk backward through the bracket chain to find the surviving faction
 * that should substitute for an eliminated attacker in a multi-party battle.
 *
 * The PvP bracket is generated as adjacent pairs: [D vs C, C vs B, B vs A].
 * If C is eliminated (D won), pair "C vs B" needs D as the attacker.
 * This function traces the chain: who beat C? Check D vs C → D has ships → D.
 * For cascading wins (D beats C, then D beats B), it walks further back.
 */
function findBracketWinner(
  state: GameState,
  sectorKey: string,
  pairs: readonly { attacker: PlayerId | NpcType; defender: PlayerId | NpcType }[],
  targetPairIndex: number,
): PlayerId | NpcType | null {
  let lookingFor = pairs[targetPairIndex]!.attacker;

  for (let i = targetPairIndex - 1; i >= 0; i--) {
    const pair = pairs[i]!;
    // Only follow the chain through pairs that include the eliminated faction
    if (pair.attacker !== lookingFor && pair.defender !== lookingFor) continue;

    const other = pair.attacker === lookingFor ? pair.defender : pair.attacker;

    const otherShips = getActiveShipsInSector(state, sectorKey, other);
    if (otherShips.length > 0) return other;

    const lfShips = getActiveShipsInSector(state, sectorKey, lookingFor);
    if (lfShips.length > 0) return lookingFor;

    // Both eliminated — continue tracing the chain
    lookingFor = other;
  }

  return null;
}

/**
 * Check if a battle pair is Draco vs Ancient (they coexist, should skip combat).
 */
function isDracoVsAncientPair(
  state: GameState,
  sideA: PlayerId | NpcType,
  sideB: PlayerId | NpcType,
): boolean {
  if (sideA === NpcTypeValue.Ancient && !isNpcOwner(sideB)) {
    return isDescendantsOfDraco(state, sideB as PlayerId);
  }
  if (sideB === NpcTypeValue.Ancient && !isNpcOwner(sideA)) {
    return isDescendantsOfDraco(state, sideA as PlayerId);
  }
  return false;
}

export function advanceToNextBattleOrComplete(state: GameState): GameState {
  const cs = state.combatState!;
  const currentBattle = cs.battles[cs.currentBattleIndex]!;

  // 1. Per-battle bombardment (must happen BEFORE discovery — Draco pop survival
  //    determines who gets the discovery tile)
  if (!cs.bombardmentDone) {
    const afterBombardment = performPerBattleBombardment(state, currentBattle.sectorKey);
    if (afterBombardment.subPhase?.type === 'BOMBARDMENT_CHOICE') {
      return afterBombardment; // halt for player input
    }
    // Auto-handled or nothing to do — continue with updated state
    state = afterBombardment;
  }

  // 2. Per-battle disc removal: if bombardment destroyed all pops, remove the disc
  //    before discovery check (e.g. Draco pops wiped by neutron bombs → disc removed
  //    → attacker gets discovery instead of Draco)
  state = removeDefeatedInfluenceDiscs(state);

  // 3. Per-battle discovery: check if the current battle's sector has an unclaimed tile
  //    (after bombardment + disc removal so Draco pop survival determines who gets the tile)
  const sector = state.board.sectors[currentBattle.sectorKey];
  if (sector?.discoveryTile && sector.ancients === 0) {
    // Eligible player: influence disc owner first, then sole ship owner
    let eligiblePlayer: PlayerId | null = null;
    if (sector.influenceDisc && !isNpcOwner(sector.influenceDisc)) {
      eligiblePlayer = sector.influenceDisc as PlayerId;
    } else {
      const playerOwners = new Set<string>();
      for (const ship of sector.ships) {
        if (!isNpcOwner(ship.owner)) playerOwners.add(ship.owner);
      }
      if (playerOwners.size === 1) {
        eligiblePlayer = Array.from(playerOwners)[0] as PlayerId;
      }
    }
    if (eligiblePlayer) {
      return {
        ...state,
        subPhase: {
          type: 'DISCOVERY_DECISION',
          playerId: eligiblePlayer,
          tileId: sector.discoveryTile,
          sectorKey: currentBattle.sectorKey,
        },
      };
    }
  }

  const nextBattleIndex = cs.currentBattleIndex + 1;

  if (nextBattleIndex < cs.battles.length) {
    // More battles to process — clear actor info for AWAITING_START, reset bombardmentDone
    return {
      ...state,
      combatState: {
        ...state.combatState!,
        currentBattleIndex: nextBattleIndex,
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
        bombardmentDone: false,
        retreatDecisionOfferedTo: [],
        retreatDeclaredInRound: null,
        retreatedPlayerIds: [],
        reputationProcessedPlayers: [],
        ...CLEARED_ACTOR,
      },
    };
  }

  // All battles done — advance to post-battle cleanup, clear actor info
  return {
    ...state,
    combatState: {
      ...state.combatState!,
      step: 'POST_BATTLE',
      ...CLEARED_ACTOR,
    },
  };
}
