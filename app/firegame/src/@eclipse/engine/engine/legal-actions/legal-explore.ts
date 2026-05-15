import { PhaseType, RingType } from '@data/enums';
import { SECTORS_BY_ID } from '@data/definitions/sectors/index';
import type {
  GameState,
  ExploreAction,
  PlayerId,
} from '../types';
import type { HexCoord } from '@data/types/common';
import {
  isPlayerTurn,
  playerHasTech,
} from '../state/state-queries';
import {
  hexNeighbors,
  hexRingType,
  positionToKey,
} from '../hex/hex-math';

/**
 * Enumerate all single-activation explore actions available to a player.
 * Returns one ExploreAction per valid adjacent empty hex, with placeholder
 * decision='PLACE' and rotation=0 (since the drawn tile is unknown).
 */
export function getLegalExploreActions(
  state: GameState,
  playerId: PlayerId,
): readonly ExploreAction[] {
  // Gate checks
  if (state.phase !== PhaseType.Action) return [];
  const player = state.players[playerId];
  if (!player) return [];
  if (player.eliminated) return [];
  if (player.hasPassed) return [];
  if (!isPlayerTurn(state, playerId)) return [];
  if (player.influenceDiscs.onTrack <= 0) return [];

  const hasWormholeGen = playerHasTech(player, 'wormhole_generator');

  // Collect all empty positions adjacent to player's controlled/occupied sectors
  const candidateKeys = new Set<string>();
  const candidatePositions = new Map<string, HexCoord>();

  for (const [, sector] of Object.entries(state.board.sectors)) {
    const isPlayerSector =
      sector.influenceDisc === playerId ||
      sector.ships.some(s => s.owner === playerId);
    if (!isPlayerSector) continue;

    const sectorDef = SECTORS_BY_ID[sector.sectorId];
    if (!sectorDef) continue;

    const neighbors = hexNeighbors(sector.position);
    for (let edgeIdx = 0; edgeIdx < neighbors.length; edgeIdx++) {
      const neighborPos = neighbors[edgeIdx]!;
      const neighborKey = positionToKey(neighborPos);

      // Must be empty
      if (state.board.sectors[neighborKey]) continue;
      if (candidateKeys.has(neighborKey)) continue;

      // Check ring — can't explore galactic center
      const ring = hexRingType(neighborPos);
      if (ring === RingType.GalacticCenter) continue;

      // Check wormhole edge from sector toward target
      if (!hasWormholeGen) {
        // Need a wormhole on the sector's edge facing this neighbor
        const rotatedEdges = sectorDef.wormholes.edges.map(
          (edge: number) => (edge + sector.rotation) % 6,
        );
        if (!rotatedEdges.includes(edgeIdx)) continue;
      }

      // Check appropriate stack is non-empty
      const stackKey = ringToStackKey(ring);
      const stack = state.sectorStacks[stackKey];
      if (stack.length === 0) continue;

      candidateKeys.add(neighborKey);
      candidatePositions.set(neighborKey, neighborPos);
    }
  }

  // Build actions
  const results: ExploreAction[] = [];
  for (const [, pos] of Array.from(candidatePositions.entries())) {
    results.push({
      type: 'EXPLORE',
      activations: [{
        targetPosition: pos,
        decision: 'PLACE',
        rotation: 0,
      }],
    });
  }

  return results;
}

function ringToStackKey(ring: RingType): 'inner' | 'middle' | 'outer' {
  switch (ring) {
    case RingType.Inner:
      return 'inner';
    case RingType.Middle:
      return 'middle';
    default:
      return 'outer';
  }
}
