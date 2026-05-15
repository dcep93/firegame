import { PhaseType, ShipType, NpcType, SpeciesId } from '@data/enums';
import { SPECIES } from '@data/definitions/species';
import { SECTORS_BY_ID } from '@data/definitions/sectors/index';
import type { HexCoord } from '@data/types/common';
import type {
  GameState,
  MoveAction,
  MoveActivation,
  PlayerId,
} from '../types';
import {
  updatePlayer,
  moveShip,
  moveDiscToAction,
  sendBoardCubeToGraveyard,
  updateSector,
} from '../state/state-helpers';
import {
  isPlayerTurn,
  playerHasTech,
  getPlayerShips,
  getShipsInSector,
} from '../state/state-queries';
import { positionToKey } from '../hex/hex-math';
import { getWormholeNeighbors } from '../hex/wormhole';
import { appendEvent, createEvent } from '../utils/events';
import { breakDiplomacy } from './diplomacy';
import { isNpcOwner, isNpcFriendlyToPlayer } from '../combat/combat-helpers';

// ── Shared single-activation validation ──

/**
 * Validate a single move activation (ship lookup, pinning, path connectivity).
 * Shared by initial move and continuation move validation.
 */
function validateSingleActivation(
  state: GameState,
  playerId: PlayerId,
  activation: MoveActivation,
  hasWormholeGen: boolean,
  hasCloaking: boolean,
): string | null {
  const allShips = getPlayerShips(state, playerId);
  const shipEntry = allShips.find((e) => e.ship.id === activation.shipId);
  if (!shipEntry) {
    return `Ship '${activation.shipId}' not found.`;
  }

  if (shipEntry.ship.owner !== playerId) {
    return 'Ship not owned by player.';
  }

  if (shipEntry.ship.type === ShipType.Starbase) {
    return 'Starbases cannot move.';
  }

  // Check pinning
  const pinError = checkPinning(state, playerId, shipEntry.sectorKey, hasCloaking);
  if (pinError) return pinError;

  // Check movement value
  const player = state.players[playerId]!;
  const blueprint = player.blueprints[shipEntry.ship.type];
  const maxMovement = blueprint.computed.movement;

  if (activation.path.length === 0) {
    return 'Path must have at least one step.';
  }

  if (activation.path.length > maxMovement) {
    return `Path length ${activation.path.length} exceeds movement value ${maxMovement}.`;
  }

  // Validate path connectivity
  let currentPos = state.board.sectors[shipEntry.sectorKey]!.position;
  for (let step = 0; step < activation.path.length; step++) {
    const nextPos = activation.path[step]!;
    const nextKey = positionToKey(nextPos);

    if (!state.board.sectors[nextKey]) {
      return `Step ${step + 1}: Destination sector not explored.`;
    }

    const reachable = getWormholeNeighbors(
      state.board,
      currentPos,
      SECTORS_BY_ID,
      hasWormholeGen,
    );
    const isReachable = reachable.some(
      (pos) => pos.q === nextPos.q && pos.r === nextPos.r,
    );
    if (!isReachable) {
      return `Step ${step + 1}: No wormhole connection.`;
    }

    // Check pass-through blocking for intermediate steps (not the final destination)
    if (step < activation.path.length - 1) {
      const blockErr = checkPassThroughBlocking(state, playerId, nextKey, hasCloaking);
      if (blockErr) return `Step ${step + 1}: ${blockErr}`;
    }

    currentPos = nextPos;
  }

  return null;
}

// ── Validate ──

export function validateMove(
  state: GameState,
  playerId: PlayerId,
  action: MoveAction,
): string | null {
  // Branch: continuation move
  if (state.subPhase?.type === 'MOVE_CONTINUATION') {
    return validateMoveContinuation(state, playerId, action);
  }

  // Initial move validation
  if (state.phase !== PhaseType.Action) {
    return 'Can only move during the Action phase.';
  }
  const player = state.players[playerId];
  if (!player) return 'Player not found.';
  if (player.hasPassed) return 'Player has already passed.';
  if (!isPlayerTurn(state, playerId)) return 'Not this player\'s turn.';
  if (player.influenceDiscs.onTrack <= 0) return 'No influence discs available.';

  if (action.activations.length !== 1) {
    return 'Move must have exactly 1 activation.';
  }

  const hasWormholeGen = playerHasTech(player, 'wormhole_generator');
  const hasCloaking = playerHasTech(player, 'cloaking_device');

  const err = validateSingleActivation(
    state,
    playerId,
    action.activations[0]!,
    hasWormholeGen,
    hasCloaking,
  );
  if (err) return `Activation 1: ${err}`;

  return null;
}

function validateMoveContinuation(
  state: GameState,
  playerId: PlayerId,
  action: MoveAction,
): string | null {
  const sub = state.subPhase;
  if (sub?.type !== 'MOVE_CONTINUATION') {
    return 'No MOVE_CONTINUATION subPhase active.';
  }

  if (sub.playerId !== playerId) {
    return 'Not the player who started the move.';
  }

  if (sub.activationsUsed >= sub.maxActivations) {
    return 'All move activations used.';
  }

  if (action.activations.length !== 1) {
    return 'Move must have exactly 1 activation.';
  }

  const player = state.players[playerId]!;
  const hasWormholeGen = playerHasTech(player, 'wormhole_generator');
  const hasCloaking = playerHasTech(player, 'cloaking_device');

  const err = validateSingleActivation(
    state,
    playerId,
    action.activations[0]!,
    hasWormholeGen,
    hasCloaking,
  );
  if (err) return err;

  return null;
}

// ── Execute ──

export function executeMove(
  state: GameState,
  playerId: PlayerId,
  action: MoveAction,
): GameState {
  const isContinuation = state.subPhase?.type === 'MOVE_CONTINUATION';
  let result = state;

  if (!isContinuation) {
    // Initial move: cost disc + increment action counter
    result = moveDiscToAction(result, playerId);

    const player = result.players[playerId]!;
    result = updatePlayer(result, playerId, {
      actionsThisRound: {
        ...player.actionsThisRound,
        move: player.actionsThisRound.move + 1,
      },
    });
  }

  // Execute the single activation
  const activation = action.activations[0]!;
  const shipEntry = getPlayerShips(result, playerId).find(
    (e) => e.ship.id === activation.shipId,
  );
  if (!shipEntry) return result;

  let currentKey = shipEntry.sectorKey;
  const startPos = result.board.sectors[currentKey]!.position;

  // Move step by step through path
  for (const nextPos of activation.path) {
    const nextKey = positionToKey(nextPos);
    result = moveShip(result, activation.shipId, currentKey, nextKey);
    currentKey = nextKey;
  }

  // Update entryOrder for the ship in its final sector
  const finalKey = currentKey;
  const finalSector = result.board.sectors[finalKey]!;
  const maxEntryOrder = Math.max(
    0,
    ...finalSector.ships.map((s) => s.entryOrder),
  );
  const updatedShips = finalSector.ships.map((s) =>
    s.id === activation.shipId
      ? { ...s, entryOrder: maxEntryOrder + 1 }
      : s,
  );
  result = {
    ...result,
    board: {
      ...result.board,
      sectors: {
        ...result.board.sectors,
        [finalKey]: { ...finalSector, ships: updatedShips },
      },
    },
  };

  // Log event
  const finalPos = activation.path[activation.path.length - 1]!;
  const event = createEvent('SHIP_MOVED', {
    playerId,
    shipId: activation.shipId,
    from: startPos,
    to: finalPos,
  });
  result = { ...result, eventLog: appendEvent(result.eventLog, event) };

  // Planta: auto-destroy population when enemy ships enter sector
  result = plantaAutoDestroyPopulation(result, finalKey, playerId);

  // Acts of Aggression: check if we moved into a diplomatic ally's sector
  result = detectAggression(result, playerId, activation.path);

  // Manage subPhase
  if (isContinuation) {
    const sub = state.subPhase as { type: 'MOVE_CONTINUATION'; playerId: PlayerId; activationsUsed: number; maxActivations: number };
    const newUsed = sub.activationsUsed + 1;
    if (newUsed >= sub.maxActivations) {
      result = { ...result, subPhase: null };
    } else {
      result = {
        ...result,
        subPhase: { ...sub, activationsUsed: newUsed },
      };
    }
  } else {
    // Initial move: create continuation subPhase if multi-activation
    const player = state.players[playerId]!;
    const species = SPECIES[player.speciesId]!;
    const maxActivations = species.activationLimits.move +
      (playerHasTech(player, 'improved_logistics') ? 1 : 0);

    if (maxActivations > 1) {
      result = {
        ...result,
        subPhase: {
          type: 'MOVE_CONTINUATION',
          playerId,
          activationsUsed: 1,
          maxActivations,
        },
      };
    }
  }

  return result;
}

// ── Move Finish ──

export function validateMoveFinish(
  state: GameState,
  playerId: PlayerId,
): string | null {
  if (state.subPhase?.type !== 'MOVE_CONTINUATION') {
    return 'No MOVE_CONTINUATION subPhase active.';
  }
  if (state.subPhase.playerId !== playerId) {
    return 'Not the player who started the move.';
  }
  return null;
}

export function executeMoveFinish(
  state: GameState,
  _playerId: PlayerId,
): GameState {
  return { ...state, subPhase: null };
}

// ── Planta population auto-destruction ──

/**
 * When enemy ships enter a Planta-controlled sector, all population cubes
 * are automatically destroyed (moved to graveyard).
 */
function plantaAutoDestroyPopulation(
  state: GameState,
  sectorKey: string,
  moverId: PlayerId,
): GameState {
  const sector = state.board.sectors[sectorKey]!;
  if (sector.populations.length === 0 && !sector.structures.orbitalPopulation) return state;

  const owner = sector.influenceDisc;
  if (!owner || owner === moverId) return state;

  const ownerPlayer = state.players[owner];
  if (!ownerPlayer || ownerPlayer.speciesId !== SpeciesId.Planta) return state;

  let result = state;
  for (const pop of sector.populations) {
    result = sendBoardCubeToGraveyard(result, owner, pop.sourceTrack);
    result = {
      ...result,
      eventLog: appendEvent(
        result.eventLog,
        createEvent('POPULATION_DESTROYED', {
          sector: sector.position,
          track: pop.sourceTrack,
          destroyedBy: moverId,
        }),
      ),
    };
  }
  result = updateSector(result, sectorKey, { populations: [] });

  // Destroy orbital population too
  const orbitalPop = result.board.sectors[sectorKey]!.structures.orbitalPopulation;
  if (orbitalPop) {
    result = sendBoardCubeToGraveyard(result, owner, orbitalPop.track);
    result = updateSector(result, sectorKey, {
      structures: { ...result.board.sectors[sectorKey]!.structures, orbitalPopulation: null },
    });
    result = {
      ...result,
      eventLog: appendEvent(
        result.eventLog,
        createEvent('POPULATION_DESTROYED', {
          sector: sector.position,
          track: orbitalPop.track,
          destroyedBy: moverId,
        }),
      ),
    };
  }

  return result;
}

// ── Pinning ──

/**
 * Check if a ship is pinned in its sector.
 * Returns an error string if pinned, null if free to move.
 */
function checkPinning(
  state: GameState,
  playerId: PlayerId,
  sectorKey: string,
  hasCloaking: boolean,
): string | null {
  const shipsInSector = getShipsInSector(state, sectorKey);

  const enemyShips = shipsInSector.filter((s) => {
    if (s.owner === playerId) return false;
    if (s.type === ShipType.Starbase) return false;
    // Draco coexists with ancients — they don't pin
    if (isNpcOwner(s.owner) && isNpcFriendlyToPlayer(state, s.owner, playerId)) return false;
    return true;
  });

  if (enemyShips.length === 0) return null;

  // GCDS pins all ships in its sector
  const hasGCDS = enemyShips.some((s) => s.owner === NpcType.GCDS);
  if (hasGCDS) {
    return 'Ship is pinned by GCDS.';
  }

  const playerShips = shipsInSector.filter(
    (s) => s.owner === playerId && s.type !== ShipType.Starbase,
  );
  const playerShipCount = playerShips.length;

  // Cloaking Device: 2 enemy ships required to pin each of your ships.
  // Does NOT help against NPCs (ancients, guardians) — only player enemies.
  const hasNpcEnemies = enemyShips.some((s) => isNpcOwner(s.owner));
  if (hasCloaking && !hasNpcEnemies) {
    if (enemyShips.length >= playerShipCount * 2) {
      return 'Ship is pinned (cloaking device \u2014 2:1 pin ratio exceeded).';
    }
    return null;
  }

  // Normal pinning: each enemy ship pins one of your ships
  if (enemyShips.length >= playerShipCount) {
    return 'Ship is pinned by enemy ships.';
  }

  return null;
}

// ── Pass-through blocking ──

/**
 * Check if a sector blocks a ship from passing through (intermediate step).
 * Stricter than origin pinning: ANY NPC blocks all ships.
 * Player enemies block if enemies >= (friendly already there + 1 for passing ship).
 * Cloaking Device doubles the enemy count needed to block (player enemies only).
 */
function checkPassThroughBlocking(
  state: GameState,
  playerId: PlayerId,
  sectorKey: string,
  hasCloaking: boolean,
): string | null {
  const shipsInSector = getShipsInSector(state, sectorKey);
  const enemyShips = shipsInSector.filter((s) => {
    if (s.owner === playerId) return false;
    if (s.type === ShipType.Starbase) return false;
    // Draco coexists with ancients — they don't block
    if (isNpcOwner(s.owner) && isNpcFriendlyToPlayer(state, s.owner, playerId)) return false;
    return true;
  });
  if (enemyShips.length === 0) return null;

  // Non-friendly NPCs always block — cloaking doesn't help against guardians/GCDS
  if (enemyShips.some((s) => isNpcOwner(s.owner))) {
    return 'Cannot pass through sector with NPC ships.';
  }

  const friendlyShips = shipsInSector.filter(
    (s) => s.owner === playerId && s.type !== ShipType.Starbase,
  );
  // With cloaking: 2 enemies needed per ship to block
  const effectiveFriendly = hasCloaking
    ? (friendlyShips.length + 1) * 2
    : friendlyShips.length + 1;
  if (enemyShips.length >= effectiveFriendly) {
    return 'Cannot pass through sector — blocked by enemy ships.';
  }
  return null;
}

// ── Acts of Aggression ──

/**
 * Detect if moving through or into a diplomatic ally's controlled sector
 * constitutes an Act of Aggression. If so, break diplomacy.
 *
 * Cloaking Device exception: passing through (but not stopping in)
 * an ally's sector is NOT aggression if ships remain unpinned.
 */
function detectAggression(
  state: GameState,
  moverId: PlayerId,
  path: readonly HexCoord[],
): GameState {
  const mover = state.players[moverId]!;
  if (mover.ambassadorsGiven.length === 0) return state;

  const allies = new Set(mover.ambassadorsGiven.map(a => a.playerId));
  const aggressedAllies = new Set<PlayerId>();

  for (const pos of path) {
    const key = positionToKey(pos);
    const sector = state.board.sectors[key];
    if (!sector) continue;

    const owner = sector.influenceDisc;
    if (!owner || !allies.has(owner)) continue;

    // Moving into an ally's controlled sector is aggression
    aggressedAllies.add(owner);
  }

  let result = state;
  for (const victimId of Array.from(aggressedAllies)) {
    result = breakDiplomacy(result, moverId, victimId);
  }

  return result;
}
