/** Axial coordinate to pixel conversion for pointy-top hexagons */

export interface PixelPoint {
  x: number;
  y: number;
}

export interface HexCoord {
  q: number;
  r: number;
}

const SQRT3 = Math.sqrt(3);

/**
 * Convert axial hex coordinates to pixel position (pointy-top orientation).
 */
export function hexToPixel(coord: HexCoord, hexSize: number): PixelPoint {
  return {
    x: hexSize * (SQRT3 * coord.q + (SQRT3 / 2) * coord.r),
    y: hexSize * (1.5 * coord.r),
  };
}

/**
 * Convert pixel position back to fractional axial coordinates.
 */
export function pixelToHex(point: PixelPoint, hexSize: number): HexCoord {
  const q = ((SQRT3 / 3) * point.x - (1 / 3) * point.y) / hexSize;
  const r = ((2 / 3) * point.y) / hexSize;
  return hexRound({ q, r });
}

/**
 * Round fractional hex coordinates to the nearest hex.
 */
function hexRound(coord: { q: number; r: number }): HexCoord {
  const s = -coord.q - coord.r;
  let rq = Math.round(coord.q);
  let rr = Math.round(coord.r);
  const rs = Math.round(s);

  const qDiff = Math.abs(rq - coord.q);
  const rDiff = Math.abs(rr - coord.r);
  const sDiff = Math.abs(rs - s);

  if (qDiff > rDiff && qDiff > sDiff) {
    rq = -rr - rs;
  } else if (rDiff > sDiff) {
    rr = -rq - rs;
  }

  return { q: rq, r: rr };
}

/**
 * Get the 6 corner points of a pointy-top hex.
 */
export function hexCorners(center: PixelPoint, hexSize: number): PixelPoint[] {
  const corners: PixelPoint[] = [];
  for (let i = 0; i < 6; i++) {
    const angleDeg = 60 * i - 30; // pointy-top starts at -30
    const angleRad = (Math.PI / 180) * angleDeg;
    corners.push({
      x: center.x + hexSize * Math.cos(angleRad),
      y: center.y + hexSize * Math.sin(angleRad),
    });
  }
  return corners;
}

/**
 * Generate SVG polygon points string for a hex at center.
 */
export function hexPolygonPoints(center: PixelPoint, hexSize: number): string {
  return hexCorners(center, hexSize)
    .map(p => `${p.x},${p.y}`)
    .join(' ');
}

/**
 * Get the pixel midpoint of a hex edge (0-5).
 * Edge i connects corner i to corner (i+1)%6.
 */
export function hexEdgeMidpoint(center: PixelPoint, hexSize: number, edge: number): PixelPoint {
  const corners = hexCorners(center, hexSize);
  const a = corners[edge]!;
  const b = corners[(edge + 1) % 6]!;
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}
