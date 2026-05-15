import { SECTORS_BY_ID } from '@data/definitions/sectors/index';
import type { HexCoord } from '@data/types/common';
import type { GameState, PlayerId } from '../types';
import { positionToKey } from '../hex/hex-math';
import { getWormholeNeighbors } from '../hex/wormhole';
import { updateSector } from '../state/state-helpers';
import { playerHasTech } from '../state/state-queries';
import { appendEvent, createEvent } from '../utils/events';
import { isNpcOwner } from './combat-helpers';
import type { ShipType } from '@data/enums';

export function getValidRetreatTargets(
  state: GameState,
  playerId: PlayerId,
  sectorKey: string,
): readonly HexCoord[] {
  const sector = state.board.sectors[sectorKey];
  if (!sector) return [];

  const player = state.players[playerId]!;
  const hasWG = playerHasTech(player, 'wormhole_generator');

  const neighbors = getWormholeNeighbors(
    state.board,
    sector.position,
    SECTORS_BY_ID,
    hasWG,
  );

  return neighbors.filter((neighbor) => {
    const neighborKey = positionToKey(neighbor);
    const neighborSector = state.board.sectors[neighborKey];
    if (!neighborSector) return false;

    // Must be controlled by retreating player
    if (neighborSector.influenceDisc !== playerId) return false;

    // Must have no enemy ships
    const hasEnemyShips = neighborSector.ships.some(
      (s) => s.owner !== playerId && !isNpcOwner(s.owner),
    );
    if (hasEnemyShips) return false;

    // Must have no NPC ships (enemy)
    const hasNpcShips = neighborSector.ships.some((s) => isNpcOwner(s.owner));
    if (hasNpcShips) return false;

    return true;
  });
}

export function validateRetreat(
  state: GameState,
  playerId: PlayerId,
  shipType: ShipType,
  retreatTarget: HexCoord,
  sectorKey: string,
): string | null {
  const validTargets = getValidRetreatTargets(state, playerId, sectorKey);
  const targetKey = positionToKey(retreatTarget);

  const isValid = validTargets.some(
    (t) => positionToKey(t) === targetKey,
  );

  if (!isValid) {
    return 'Invalid retreat target: must be connected, controlled, and free of enemies';
  }

  // Check player has ships of this type in sector that aren't already retreating
  const sector = state.board.sectors[sectorKey]!;
  const activeShips = sector.ships.filter(
    (s) => s.owner === playerId && s.type === shipType && !s.isRetreating,
  );

  if (activeShips.length === 0) {
    return 'No active ships of this type to retreat';
  }

  return null;
}

export function initiateRetreat(
  state: GameState,
  playerId: PlayerId,
  shipType: ShipType,
  retreatTarget: HexCoord,
  sectorKey: string,
): GameState {
  const sector = state.board.sectors[sectorKey]!;
  const updatedShips = sector.ships.map((s) => {
    if (s.owner === playerId && s.type === shipType && !s.isRetreating) {
      return { ...s, isRetreating: true, retreatTarget };
    }
    return s;
  });

  return updateSector(state, sectorKey, { ships: updatedShips });
}

export function completeRetreat(
  state: GameState,
  playerId: PlayerId,
  shipType: ShipType,
  sectorKey: string,
): GameState {
  const sector = state.board.sectors[sectorKey]!;
  const retreatingShips = sector.ships.filter(
    (s) => s.owner === playerId && s.type === shipType && s.isRetreating,
  );

  if (retreatingShips.length === 0) return state;

  const retreatTarget = retreatingShips[0]!.retreatTarget!;
  const targetKey = positionToKey(retreatTarget);
  let result = state;

  // Remove from battle sector, add to target
  const remainingShips = sector.ships.filter(
    (s) => !(s.owner === playerId && s.type === shipType && s.isRetreating),
  );
  result = updateSector(result, sectorKey, { ships: remainingShips });

  const targetSector = result.board.sectors[targetKey]!;
  const movedShips = retreatingShips.map((s) => ({
    ...s,
    isRetreating: false,
    retreatTarget: null,
    damage: 0, // Reset damage on retreat
  }));
  result = updateSector(result, targetKey, {
    ships: [...targetSector.ships, ...movedShips],
  });

  // Log event
  result = {
    ...result,
    eventLog: appendEvent(
      result.eventLog,
      createEvent('RETREAT', {
        playerId,
        shipType,
        from: sector.position,
        to: retreatTarget,
      }),
    ),
  };

  return result;
}

export function initiateRetreatByIds(
  state: GameState,
  playerId: PlayerId,
  shipIds: readonly string[],
  retreatTarget: HexCoord,
  sectorKey: string,
): GameState {
  const sector = state.board.sectors[sectorKey]!;
  const idSet = new Set(shipIds);
  const updatedShips = sector.ships.map((s) => {
    if (s.owner === playerId && idSet.has(s.id) && !s.isRetreating) {
      return { ...s, isRetreating: true, retreatTarget };
    }
    return s;
  });

  let result = updateSector(state, sectorKey, { ships: updatedShips });

  // Log RETREAT events grouped by ship type
  const retreatingShips = sector.ships.filter(s => s.owner === playerId && idSet.has(s.id));
  const byType = new Map<ShipType, number>();
  for (const s of retreatingShips) {
    byType.set(s.type, (byType.get(s.type) ?? 0) + 1);
  }
  for (const [shipType] of Array.from(byType.entries())) {
    result = {
      ...result,
      eventLog: appendEvent(
        result.eventLog,
        createEvent('RETREAT', {
          playerId,
          shipType,
          from: sector.position,
          to: retreatTarget,
        }),
      ),
    };
  }

  return result;
}

export function completeAllPendingRetreats(
  state: GameState,
  playerId: PlayerId,
  sectorKey: string,
): GameState {
  const sector = state.board.sectors[sectorKey];
  if (!sector) return state;

  // Get unique ship types that are retreating for this player
  const retreatingTypes = new Set<ShipType>();
  for (const ship of sector.ships) {
    if (ship.owner === playerId && ship.isRetreating) {
      retreatingTypes.add(ship.type);
    }
  }

  let result = state;
  for (const shipType of Array.from(retreatingTypes)) {
    result = completeRetreat(result, playerId, shipType, sectorKey);
  }
  return result;
}

export function allShipsRetreating(
  state: GameState,
  sectorKey: string,
  playerId: PlayerId,
): boolean {
  const sector = state.board.sectors[sectorKey];
  if (!sector) return false;

  const playerShips = sector.ships.filter((s) => s.owner === playerId);
  if (playerShips.length === 0) return false;

  return playerShips.every((s) => s.isRetreating);
}
