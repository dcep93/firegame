import { PhaseType } from '@data/enums';
import { SECTORS_BY_ID } from '@data/definitions/sectors/index';
import type {
  GameState,
  InfluenceAction,
  PlayerId,
} from '../types';
import type { HexCoord } from '@data/types/common';
import {
  isPlayerTurn,
  getControlledSectors,
  getPlayerShips,
  getShipsInSector,
  getSectorOwner,
} from '../state/state-queries';
import { isNpcOwner, isNpcFriendlyToPlayer } from '../combat/combat-helpers';
import { positionToKey } from '../hex/hex-math';
import { getWormholeNeighbors } from '../hex/wormhole';

/**
 * Enumerate all single-activation influence actions available to a player.
 * Returns track->sector and sector->track moves. ColonyShipFlips always 0.
 */
export function getLegalInfluenceActions(
  state: GameState,
  playerId: PlayerId,
): readonly InfluenceAction[] {
  // Gate checks
  if (state.phase !== PhaseType.Action) return [];
  const player = state.players[playerId];
  if (!player) return [];
  if (player.eliminated) return [];
  if (player.hasPassed) return [];
  if (!isPlayerTurn(state, playerId)) return [];
  if (player.influenceDiscs.onTrack <= 0) return [];

  const results: InfluenceAction[] = [];
  const controlledSectors = getControlledSectors(state, playerId);

  // Sector -> Track: for each controlled sector, player can remove their disc
  for (const sector of controlledSectors) {
    results.push({
      type: 'INFLUENCE',
      activations: [{ from: sector.position, to: 'INFLUENCE_TRACK' }],
      colonyShipFlips: 0,
    });
  }

  // Track -> Sector: find uncontrolled sectors reachable via wormhole
  // from controlled sectors or sectors with player's ships
  // Note: Wormhole Generator does NOT apply to influence actions
  const reachableUncontrolled = new Set<string>();
  const reachablePositions = new Map<string, HexCoord>();

  // Gather all sectors to check for wormhole connections
  const sectorsToCheck = new Set<string>();
  for (const sector of controlledSectors) {
    sectorsToCheck.add(positionToKey(sector.position));
  }
  for (const { sectorKey } of getPlayerShips(state, playerId)) {
    sectorsToCheck.add(sectorKey);
  }

  for (const key of Array.from(sectorsToCheck)) {
    const sector = state.board.sectors[key];
    if (!sector) continue;

    // Get reachable neighbors via wormholes (NO wormhole generator for influence)
    const reachable = getWormholeNeighbors(
      state.board,
      sector.position,
      SECTORS_BY_ID,
      false,
    );

    for (const neighborPos of reachable) {
      const neighborKey = positionToKey(neighborPos);
      if (reachableUncontrolled.has(neighborKey)) continue;

      // Must be uncontrolled
      const owner = getSectorOwner(state, neighborKey);
      if (owner !== null) continue;

      // No enemy ships (Draco coexists with ancients)
      const shipsInTarget = getShipsInSector(state, neighborKey);
      const hasEnemyShips = shipsInTarget.some(s => {
        if (s.owner === playerId) return false;
        if (isNpcOwner(s.owner) && isNpcFriendlyToPlayer(state, s.owner, playerId)) return false;
        return true;
      });
      if (hasEnemyShips) continue;

      reachableUncontrolled.add(neighborKey);
      reachablePositions.set(neighborKey, neighborPos);
    }
  }

  for (const [, pos] of Array.from(reachablePositions.entries())) {
    results.push({
      type: 'INFLUENCE',
      activations: [{ from: 'INFLUENCE_TRACK', to: pos }],
      colonyShipFlips: 0,
    });
  }

  return results;
}
