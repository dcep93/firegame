import { RingType, WormholeEdge } from '@data/enums';
import type { HexCoord } from '@data/types/common';
import type { SectorKey } from '../types';

// Axial direction offsets for pointy-top hexes, indexed by edge (0-5)
// Edge 0 = top-right, 1 = right, 2 = bottom-right, 3 = bottom-left, 4 = left, 5 = top-left
const AXIAL_DIRECTIONS: readonly HexCoord[] = [
  { q: 1, r: 0 }, // Edge 0: top-right
  { q: 1, r: -1 }, // Edge 1: right
  { q: 0, r: -1 }, // Edge 2: bottom-right
  { q: -1, r: 0 }, // Edge 3: bottom-left
  { q: -1, r: 1 }, // Edge 4: left
  { q: 0, r: 1 }, // Edge 5: top-left
];

/** Chebyshev distance in cube coordinates: max(|dq|, |dr|, |dq+dr|) */
export function hexDistance(a: HexCoord, b: HexCoord): number {
  const dq = b.q - a.q;
  const dr = b.r - a.r;
  return Math.max(Math.abs(dq), Math.abs(dr), Math.abs(dq + dr));
}

/** Returns the 6 neighboring hex positions */
export function hexNeighbors(pos: HexCoord): HexCoord[] {
  return AXIAL_DIRECTIONS.map((d) => ({ q: pos.q + d.q, r: pos.r + d.r }));
}

/** Returns the neighbor in a specific edge direction (0-5) */
export function hexNeighborAtEdge(
  pos: HexCoord,
  edge: WormholeEdge,
): HexCoord {
  const d = AXIAL_DIRECTIONS[edge]!;
  return { q: pos.q + d.q, r: pos.r + d.r };
}

/** Returns all hex positions at exactly the given radius from center */
export function hexRingPositions(
  center: HexCoord,
  radius: number,
): HexCoord[] {
  if (radius === 0) return [center];

  const results: HexCoord[] = [];
  // Start at the position radius steps in direction 4 (left) from center
  let pos: HexCoord = { q: center.q - radius, r: center.r + radius };

  for (let side = 0; side < 6; side++) {
    for (let step = 0; step < radius; step++) {
      results.push(pos);
      const d = AXIAL_DIRECTIONS[side]!;
      pos = { q: pos.q + d.q, r: pos.r + d.r };
    }
  }

  return results;
}

/** Determine game ring by distance from origin */
export function hexRingType(pos: HexCoord): RingType {
  const dist = hexDistance({ q: 0, r: 0 }, pos);
  switch (dist) {
    case 0:
      return RingType.GalacticCenter;
    case 1:
      return RingType.Inner;
    case 2:
      return RingType.Middle;
    default:
      return RingType.Outer;
  }
}

/** Convert HexCoord to "q,r" string key */
export function positionToKey(pos: HexCoord): SectorKey {
  return `${pos.q},${pos.r}`;
}

/** Convert "q,r" string key back to HexCoord */
export function keyToPosition(key: SectorKey): HexCoord {
  const [q, r] = key.split(',').map(Number);
  return { q: q!, r: r! };
}

/** Get the opposite hex edge (0↔3, 1↔4, 2↔5) */
export function getOppositeEdge(edge: WormholeEdge): WormholeEdge {
  return ((edge + 3) % 6) as WormholeEdge;
}
