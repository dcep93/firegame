import { PhaseType, ShipType, NpcType } from '@data/enums';
import { SECTORS_BY_ID } from '@data/definitions/sectors/index';
import type {
  GameState,
  MoveAction,
  PlayerId,
} from '../types';
import type { HexCoord } from '@data/types/common';
import {
  isPlayerTurn,
  playerHasTech,
  getPlayerShips,
  getShipsInSector,
} from '../state/state-queries';
import { positionToKey } from '../hex/hex-math';
import { getWormholeNeighbors } from '../hex/wormhole';
import { isNpcOwner, isNpcFriendlyToPlayer } from '../combat/combat-helpers';

/**
 * Enumerate all single-activation move actions available to a player.
 * Returns one MoveAction per (shipId, destination) combination reachable via BFS.
 *
 * When `options.skipGating` is true, phase/turn/pass/disc/eliminated checks are
 * skipped. Used during MOVE_CONTINUATION subPhase where the player has already
 * committed to the move action.
 */
export function getLegalMoveActions(
  state: GameState,
  playerId: PlayerId,
  options?: { skipGating?: boolean },
): readonly MoveAction[] {
  const player = state.players[playerId];
  if (!player) return [];

  // Gate checks (skipped during continuation)
  if (!options?.skipGating) {
    if (state.phase !== PhaseType.Action) return [];
    if (player.eliminated) return [];
    if (player.hasPassed) return [];
    if (!isPlayerTurn(state, playerId)) return [];
    if (player.influenceDiscs.onTrack <= 0) return [];
  }

  const hasWormholeGen = playerHasTech(player, 'wormhole_generator');
  const hasCloaking = playerHasTech(player, 'cloaking_device');

  const allShips = getPlayerShips(state, playerId);
  const results: MoveAction[] = [];

  for (const { ship, sectorKey } of allShips) {
    // Skip starbases
    if (ship.type === ShipType.Starbase) continue;

    // Check pinning
    if (isPinned(state, playerId, sectorKey, hasCloaking)) continue;

    // Movement range from blueprint
    const maxMovement = player.blueprints[ship.type].computed.movement;
    if (maxMovement <= 0) continue;

    const startPos = state.board.sectors[sectorKey]!.position;

    // BFS to find all reachable positions within movement range
    // Each entry: { position, key, path }
    interface BfsEntry {
      pos: HexCoord;
      key: string;
      path: HexCoord[];
    }

    const visited = new Set<string>();
    visited.add(sectorKey);
    const queue: BfsEntry[] = [{ pos: startPos, key: sectorKey, path: [] }];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.path.length >= maxMovement) continue;

      const neighbors = getWormholeNeighbors(
        state.board,
        current.pos,
        SECTORS_BY_ID,
        hasWormholeGen,
      );

      for (const neighborPos of neighbors) {
        const neighborKey = positionToKey(neighborPos);
        if (visited.has(neighborKey)) continue;
        visited.add(neighborKey);

        const newPath = [...current.path, neighborPos];

        // Add move to this destination
        results.push({
          type: 'MOVE',
          activations: [{
            shipId: ship.id,
            path: newPath,
          }],
        });

        // Continue BFS if we haven't reached max movement AND sector isn't blocked
        if (newPath.length < maxMovement && !isBlockedForPassThrough(state, playerId, neighborKey, hasCloaking)) {
          queue.push({ pos: neighborPos, key: neighborKey, path: newPath });
        }
      }
    }
  }

  return results;
}

/**
 * Check if a sector blocks a ship from passing through (intermediate step).
 * Stricter than origin pinning: ANY NPC blocks all ships.
 * Player enemies block if enemies >= (friendly + 1 for the passing ship).
 */
function isBlockedForPassThrough(
  state: GameState,
  playerId: PlayerId,
  sectorKey: string,
  hasCloaking: boolean,
): boolean {
  const shipsInSector = getShipsInSector(state, sectorKey);
  const enemyShips = shipsInSector.filter(s => {
    if (s.owner === playerId) return false;
    if (s.type === ShipType.Starbase) return false;
    // Draco coexists with ancients — they don't block
    if (isNpcOwner(s.owner) && isNpcFriendlyToPlayer(state, s.owner, playerId)) return false;
    return true;
  });
  if (enemyShips.length === 0) return false;

  // Non-friendly NPCs always block — cloaking doesn't help against guardians/GCDS
  if (enemyShips.some(s => isNpcOwner(s.owner))) return true;

  // Player enemies: blocked if enemies >= effective friendly count
  // Cloaking doubles the enemy count needed to block
  const friendlyShips = shipsInSector.filter(
    s => s.owner === playerId && s.type !== ShipType.Starbase,
  );
  const effectiveFriendly = hasCloaking
    ? (friendlyShips.length + 1) * 2
    : friendlyShips.length + 1;
  return enemyShips.length >= effectiveFriendly;
}

function isPinned(
  state: GameState,
  playerId: PlayerId,
  sectorKey: string,
  hasCloaking: boolean,
): boolean {
  const shipsInSector = getShipsInSector(state, sectorKey);

  const enemyShips = shipsInSector.filter(s => {
    if (s.owner === playerId) return false;
    if (s.type === ShipType.Starbase) return false;
    // Draco coexists with ancients — they don't pin
    if (isNpcOwner(s.owner) && isNpcFriendlyToPlayer(state, s.owner, playerId)) return false;
    return true;
  });
  if (enemyShips.length === 0) return false;

  // GCDS pins all
  if (enemyShips.some(s => s.owner === NpcType.GCDS)) return true;

  const playerShips = shipsInSector.filter(
    s => s.owner === playerId && s.type !== ShipType.Starbase,
  );

  // Cloaking Device: 2 enemy ships required to pin each of your ships.
  // Does NOT help against NPCs (guardians, GCDS).
  const hasNpcEnemies = enemyShips.some(s => isNpcOwner(s.owner));
  if (hasCloaking && !hasNpcEnemies) {
    return enemyShips.length >= playerShips.length * 2;
  }

  // Normal pinning: each enemy pins one ship. All pinned if enemies >= player count
  return enemyShips.length >= playerShips.length;
}
