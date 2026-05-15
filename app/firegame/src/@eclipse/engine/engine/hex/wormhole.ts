import { WormholeEdge } from '@data/enums';
import type { HexCoord, WormholeConfig } from '@data/types/common';
import type { SectorDefinition } from '@data/types/sector';
import type { BoardState, PlacedSector } from '../types';
import {
  getOppositeEdge,
  hexNeighborAtEdge,
  hexNeighbors,
  positionToKey,
} from './hex-math';

/** Apply rotation (0-5) to wormhole edges: (edge + rotation) % 6 */
export function getRotatedWormholes(
  config: WormholeConfig,
  rotation: number,
): WormholeEdge[] {
  return config.edges.map(
    (edge) => ((edge + rotation) % 6) as WormholeEdge,
  );
}

/** Check if two adjacent sectors connect via wormholes */
export function hasWormholeConnection(
  sectorA: PlacedSector,
  sectorADef: SectorDefinition,
  sectorB: PlacedSector,
  sectorBDef: SectorDefinition,
  hasWormholeGenerator: boolean,
): boolean {
  // Find which edge of A faces B
  const edgeFromAToB = findConnectingEdge(sectorA.position, sectorB.position);
  if (edgeFromAToB === null) return false;

  const edgeFromBToA = getOppositeEdge(edgeFromAToB);

  const aWormholes = getRotatedWormholes(
    sectorADef.wormholes,
    sectorA.rotation,
  );
  const bWormholes = getRotatedWormholes(
    sectorBDef.wormholes,
    sectorB.rotation,
  );

  const aHasWormhole = aWormholes.includes(edgeFromAToB);
  const bHasWormhole = bWormholes.includes(edgeFromBToA);

  if (hasWormholeGenerator) {
    // With Wormhole Generator tech: only one side needs a wormhole
    return aHasWormhole || bHasWormhole;
  }

  // Normal: both sides need wormholes on connecting edges
  return aHasWormhole && bHasWormhole;
}

/** Get all reachable neighbor positions via wormholes from a position */
export function getWormholeNeighbors(
  board: BoardState,
  position: HexCoord,
  sectorDefs: Readonly<Record<string, SectorDefinition>>,
  hasWormholeGenerator: boolean,
): HexCoord[] {
  const posKey = positionToKey(position);
  const sector = board.sectors[posKey];
  if (!sector) return [];

  const sectorDef = sectorDefs[sector.sectorId];
  if (!sectorDef) return [];

  const neighbors = hexNeighbors(position);
  const reachable: HexCoord[] = [];

  for (const neighbor of neighbors) {
    const neighborKey = positionToKey(neighbor);
    const neighborSector = board.sectors[neighborKey];
    if (!neighborSector) continue;

    const neighborDef = sectorDefs[neighborSector.sectorId];
    if (!neighborDef) continue;

    if (
      hasWormholeConnection(
        sector,
        sectorDef,
        neighborSector,
        neighborDef,
        hasWormholeGenerator,
      )
    ) {
      reachable.push(neighbor);
    }
  }

  // Warp portal connectivity: all portal sectors are neighbors of each other
  if (sector.hasWarpPortal) {
    for (const [otherKey, otherSector] of Object.entries(board.sectors)) {
      if (otherKey === posKey) continue;
      if (!otherSector.hasWarpPortal) continue;
      // Avoid duplicates (portal sector might also be a wormhole neighbor)
      if (!reachable.some(r => r.q === otherSector.position.q && r.r === otherSector.position.r)) {
        reachable.push(otherSector.position);
      }
    }
  }

  return reachable;
}

/** Find which edge of posA connects to posB (they must be adjacent) */
function findConnectingEdge(
  posA: HexCoord,
  posB: HexCoord,
): WormholeEdge | null {
  for (let edge = 0; edge < 6; edge++) {
    const neighbor = hexNeighborAtEdge(posA, edge as WormholeEdge);
    if (neighbor.q === posB.q && neighbor.r === posB.r) {
      return edge as WormholeEdge;
    }
  }
  return null;
}
