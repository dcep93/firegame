import type { SectorDefinition } from '@eclipse/shared';
import { PopulationSquareType } from '@eclipse/shared';
import { hexToPixel, hexPolygonPoints, hexCorners } from '../../services/hex-layout';

const RESOURCE_COLORS: Record<string, string> = {
  [PopulationSquareType.Money]: 'var(--resource-money)',
  [PopulationSquareType.Science]: 'var(--resource-science)',
  [PopulationSquareType.Materials]: 'var(--resource-materials)',
  [PopulationSquareType.Wild]: 'var(--resource-wild)',
};

interface GhostTileProps {
  sectorDef: SectorDefinition;
  position: { q: number; r: number };
  rotation: number;
  hexSize: number;
  committed?: boolean; // true for previously placed tiles in multi-activation
}

export function GhostTile({ sectorDef, position, rotation, hexSize, committed }: GhostTileProps) {
  const center = hexToPixel(position, hexSize);

  // Rotated wormhole edges (convert engine→visual: engine is CCW, visual is CW)
  const wormholeEdges = sectorDef.wormholes.edges.map(e => (6 - (e + rotation) % 6) % 6);

  // Population squares layout
  const popSquares = sectorDef.populationSquares ?? [];
  const squareW = 12;
  const squareH = 12;
  const squareGap = 4;

  const popGroups: Record<string, { index: number; advanced: boolean }[]> = {};
  for (let i = 0; i < popSquares.length; i++) {
    const sq = popSquares[i]!;
    (popGroups[sq.type] ??= []).push({ index: i, advanced: sq.advanced });
  }

  const GROUP_POSITIONS: Record<string, { x: number; y: number }> = {
    [PopulationSquareType.Money]:     { x: -0.38, y: -0.20 },
    [PopulationSquareType.Science]:   { x:  0.38, y: -0.20 },
    [PopulationSquareType.Materials]: { x: -0.38, y:  0.20 },
    [PopulationSquareType.Wild]:      { x:  0.38, y:  0.20 },
  };

  const vpY = center.y - hexSize * 0.46;

  return (
    <g className={committed ? 'hex-tile--ghost-committed' : 'hex-tile--ghost'}>
      {/* Hex background */}
      <polygon
        points={hexPolygonPoints(center, hexSize)}
        className="hex-fill"
        style={{ fill: committed ? 'rgba(74, 226, 144, 0.25)' : 'rgba(74, 226, 144, 0.1)' }}
      />

      {/* Wormhole indicators — filled half-circles pointing inward */}
      {wormholeEdges.map(edge => {
        const corners = hexCorners(center, hexSize);
        const a = corners[edge]!;
        const b = corners[(edge + 1) % 6]!;
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        const r = 7;
        const edgeLen = Math.hypot(b.x - a.x, b.y - a.y);
        const ux = (b.x - a.x) / edgeLen;
        const uy = (b.y - a.y) / edgeLen;
        const x1 = mid.x - ux * r;
        const y1 = mid.y - uy * r;
        const x2 = mid.x + ux * r;
        const y2 = mid.y + uy * r;
        const toCenter = { x: center.x - mid.x, y: center.y - mid.y };
        const cross = ux * toCenter.y - uy * toCenter.x;
        const sweep = cross > 0 ? 0 : 1;
        return (
          <path
            key={`ghost-wh-${edge}`}
            d={`M ${x1} ${y1} A ${r} ${r} 0 0 ${sweep} ${x2} ${y2}`}
            className="wormhole-dot"
          />
        );
      })}

      {/* VP value */}
      {sectorDef.vpValue > 0 && (
        <text
          x={center.x}
          y={vpY}
          className="sector-vp"
        >
          {sectorDef.vpValue}
        </text>
      )}

      {/* Sector ID */}
      <text
        x={center.x}
        y={center.y + hexSize * 0.62}
        style={{ fontSize: '9px', fill: 'var(--text-muted)', textAnchor: 'middle', opacity: 0.7 }}
      >
        {sectorDef.id}
      </text>

      {/* Artifact indicator — diamond superscript next to VP */}
      {sectorDef.hasArtifact && sectorDef.vpValue > 0 && (
        <text
          x={center.x + hexSize * 0.08}
          y={vpY - hexSize * 0.08}
          style={{ fontSize: '7px', fill: 'var(--accent-yellow)', textAnchor: 'middle', opacity: 0.9 }}
        >
          {'\u25C6'}
        </text>
      )}
      {sectorDef.hasArtifact && sectorDef.vpValue === 0 && (
        <text
          x={center.x}
          y={vpY}
          style={{ fontSize: '6px', fill: 'var(--accent-yellow)', textAnchor: 'middle', opacity: 0.9 }}
        >
          {'\u25C6'}
        </text>
      )}

      {/* Population squares */}
      {Object.entries(popGroups).map(([type, squares]) => {
        const pos = GROUP_POSITIONS[type];
        if (!pos) return null;
        const color = RESOURCE_COLORS[type] ?? 'var(--text-muted)';
        const groupW = squares.length * squareW + (squares.length - 1) * squareGap;
        const startX = center.x + hexSize * pos.x - groupW / 2;
        const groupY = center.y + hexSize * pos.y;
        return squares.map((sq, j) => {
          const sx = startX + j * (squareW + squareGap);
          const sy = groupY - squareH / 2;
          return (
            <g key={`ghost-pop-${sq.index}`}>
              <rect
                x={sx}
                y={sy}
                width={squareW}
                height={squareH}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                rx={2}
              />
              {sq.advanced && (
                <text
                  x={sx + squareW / 2}
                  y={sy + squareH / 2 + 1}
                  style={{ fontSize: '7px', fill: color, textAnchor: 'middle', dominantBaseline: 'central' }}
                >
                  {'\u2605'}
                </text>
              )}
            </g>
          );
        });
      })}

      {/* Ancient indicator */}
      {(sectorDef.hasAncient || (sectorDef.ancientCount ?? 0) > 0) && (
        <circle
          cx={center.x + hexSize * 0.3}
          cy={vpY}
          r={8}
          fill="var(--accent-red)"
          opacity={0.6}
        />
      )}

      {/* Discovery indicator — square with cut corner, matching HexTile */}
      {sectorDef.hasDiscovery && (() => {
        const s = 14;
        const cut = 5;
        const cx = center.x;
        const cy = center.y;
        return (
          <polygon
            points={`${cx - s + cut},${cy - s} ${cx + s},${cy - s} ${cx + s},${cy + s} ${cx - s},${cy + s} ${cx - s},${cy - s + cut}`}
            fill="none"
            stroke="var(--accent-yellow)"
            strokeWidth={1.5}
            strokeDasharray="5 3"
            opacity={0.4}
            className="discovery-ring"
          />
        );
      })()}
    </g>
  );
}
