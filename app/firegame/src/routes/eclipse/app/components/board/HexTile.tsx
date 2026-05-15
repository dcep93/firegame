import { memo } from 'react';
import type { FilteredPlacedSector } from '@eclipse/shared';
import { SECTORS_BY_ID, PopulationSquareType, NpcType } from '@eclipse/shared';
import { hexToPixel, hexPolygonPoints, hexCorners } from '../../services/hex-layout';
import { ShipIconSvg, getShipSize } from '../shared/ShipIcon';

const PLAYER_COLORS: Record<string, string> = {
  red: 'var(--player-red)',
  blue: 'var(--player-blue)',
  green: 'var(--player-green)',
  yellow: 'var(--player-yellow)',
  white: 'var(--player-white)',
  black: 'var(--player-black)',
};

const RESOURCE_COLORS: Record<string, string> = {
  [PopulationSquareType.Money]: 'var(--resource-money)',
  [PopulationSquareType.Science]: 'var(--resource-science)',
  [PopulationSquareType.Materials]: 'var(--resource-materials)',
  [PopulationSquareType.Wild]: 'var(--resource-wild)',
};

interface HexTileProps {
  sector: FilteredPlacedSector;
  hexSize: number;
  playerColors: Record<string, string>;
}

export const HexTile = memo(function HexTile({ sector, hexSize, playerColors }: HexTileProps) {
  const center = hexToPixel(sector.position, hexSize);
  const def = SECTORS_BY_ID[sector.sectorId];

  const ringClass = def?.ring === 'galactic_center' ? ' hex-fill--galactic-center'
    : def?.ring === 'guardian' ? ' hex-fill--guardian'
    : def?.ring === 'starting' ? ' hex-fill--starting'
    : '';

  const ownerColorName = sector.influenceDisc ? playerColors[sector.influenceDisc] : undefined;
  const ownerColor = sector.influenceDisc
    ? PLAYER_COLORS[ownerColorName ?? ''] ?? 'var(--accent-blue)'
    : undefined;
  const isBlackOwner = ownerColorName === 'black';

  // Build set of occupied slot indices for population squares
  const occupiedSlots = new Set(sector.populations.map(p => p.slotIndex));

  // Compute wormhole edge positions (apply rotation + convert engine→visual)
  // Engine edges go counterclockwise (E,NE,NW,W,SW,SE) but hexCorners goes
  // clockwise (E,SE,SW,W,NW,NE). Convert with: visual = (6 - engine) % 6
  const wormholeEdges = def?.wormholes.edges.map(e => (6 - (e + sector.rotation) % 6) % 6) ?? [];
  const halfWormholeEdges = def?.wormholes.halfWormholes?.map(e => (6 - (e + sector.rotation) % 6) % 6) ?? [];

  // Population squares layout — grouped by resource type in quadrants
  const popSquares = def?.populationSquares ?? [];
  const squareW = 12;
  const squareH = 12;
  const squareGap = 4;

  // Group squares by type, preserving original indices for occupancy check
  const popGroups: Record<string, { index: number; advanced: boolean }[]> = {};
  for (let i = 0; i < popSquares.length; i++) {
    const sq = popSquares[i]!;
    (popGroups[sq.type] ??= []).push({ index: i, advanced: sq.advanced });
  }

  // Position each resource type in a quadrant around the centered disc
  const GROUP_POSITIONS: Record<string, { x: number; y: number }> = {
    [PopulationSquareType.Money]:     { x: -0.38, y: -0.20 },
    [PopulationSquareType.Science]:   { x:  0.38, y: -0.20 },
    [PopulationSquareType.Materials]: { x: -0.38, y:  0.20 },
    [PopulationSquareType.Wild]:      { x:  0.38, y:  0.20 },
  };

  // Vertical layout offsets from center — disc is now centered
  const vpY = center.y - hexSize * 0.46;
  const shipY = center.y + hexSize * 0.6;

  return (
    <g className="hex-tile">
      {/* 1. Hex background */}
      <polygon
        points={hexPolygonPoints(center, hexSize)}
        className={`hex-fill${ringClass}`}
        style={ownerColor
          ? def?.ring === 'starting'
            ? { fill: ownerColor, fillOpacity: 0.06, stroke: ownerColor, strokeWidth: 2 }
            : { fill: ownerColor, fillOpacity: 0.10 }
          : undefined}
      />

      {/* 2. Wormhole indicators — filled half-circles pointing inward */}
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
        // Sweep inward (toward hex center)
        const toCenter = { x: center.x - mid.x, y: center.y - mid.y };
        const cross = ux * toCenter.y - uy * toCenter.x;
        const sweep = cross > 0 ? 0 : 1;
        return (
          <path
            key={`wh-${edge}`}
            d={`M ${x1} ${y1} A ${r} ${r} 0 0 ${sweep} ${x2} ${y2}`}
            className="wormhole-dot"
          />
        );
      })}
      {halfWormholeEdges.map(edge => {
        const corners = hexCorners(center, hexSize);
        const a = corners[edge]!;
        const b = corners[(edge + 1) % 6]!;
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        const r = 5;
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
            key={`hwh-${edge}`}
            d={`M ${x1} ${y1} A ${r} ${r} 0 0 ${sweep} ${x2} ${y2}`}
            className="wormhole-dot--half"
          />
        );
      })}

      {/* 3. VP value — centered if unconquered, top if owned */}
      {def && def.vpValue > 0 && (
        <text
          x={center.x}
          y={sector.influenceDisc ? vpY : center.y}
          className="sector-vp"
        >
          {def.vpValue}
        </text>
      )}

      {/* 4. Sector ID — visible label near bottom vertex */}
      <text
        x={center.x}
        y={center.y + hexSize * 0.85}
        style={{ fontSize: '9px', fill: 'var(--text-muted)', textAnchor: 'middle', opacity: 0.7 }}
      >
        {sector.sectorId}
      </text>

      {/* 4b. Artifact indicator — small diamond superscript next to VP */}
      {def?.hasArtifact && def.vpValue > 0 && (
        <text
          x={center.x + hexSize * 0.08}
          y={(sector.influenceDisc ? vpY : center.y) - hexSize * 0.08}
          style={{ fontSize: '7px', fill: 'var(--accent-yellow)', textAnchor: 'middle', opacity: 0.9 }}
        >
          {'\u25C6'}
        </text>
      )}
      {/* Artifact indicator for 0-VP sectors (homeworlds) — shown at top */}
      {def?.hasArtifact && def.vpValue === 0 && (
        <text
          x={center.x}
          y={vpY}
          style={{ fontSize: '6px', fill: 'var(--accent-yellow)', textAnchor: 'middle', opacity: 0.9 }}
        >
          {'\u25C6'}
        </text>
      )}

      {/* 5. Population squares — grouped by resource type */}
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
          const filled = occupiedSlots.has(sq.index);
          return (
            <g key={`pop-${sq.index}`}>
              <rect
                x={sx}
                y={sy}
                width={squareW}
                height={squareH}
                fill={filled ? color : 'none'}
                stroke={color}
                strokeWidth={1.5}
                rx={2}
              />
              {sq.advanced && (
                <text
                  x={sx + squareW / 2}
                  y={sy + squareH / 2 + 1}
                  style={{ fontSize: '7px', fill: filled ? '#000' : color, textAnchor: 'middle', dominantBaseline: 'central' }}
                >
                  {'\u2605'}
                </text>
              )}
            </g>
          );
        });
      })}

      {/* 6. Influence disc — centered */}
      {sector.influenceDisc && (
        <circle
          cx={center.x}
          cy={center.y}
          r={8}
          className="influence-disc"
          fill={ownerColor ?? 'var(--accent-blue)'}
          stroke={isBlackOwner ? 'rgba(255,255,255,0.6)' : undefined}
          strokeWidth={isBlackOwner ? 1.5 : undefined}
        />
      )}

      {/* 7. Discovery indicator — small square with cut corner at center */}
      {sector.hasUnclaimedDiscovery && (() => {
        const s = 14; // half-size
        const cut = 5; // corner cut
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

      {/* 9. Ship tokens — silhouette icons, grouped by owner+type */}
      {(() => {
        const BASE_SHIP_SIZE = 26;
        const SHIP_GAP = 4;
        // Group ships by owner+type
        const groupMap = new Map<string, { ship: typeof sector.ships[0]; isNpc: boolean; type: string; shipColor: string | undefined; count: number }>();
        for (const ship of sector.ships) {
          const isNpc = Object.values(NpcType).includes(ship.owner as NpcType);
          const type = isNpc ? (ship.owner as string) : ship.type;
          const key = `${ship.owner}:${type}`;
          const existing = groupMap.get(key);
          if (existing) {
            existing.count++;
          } else {
            const shipColor = !isNpc && typeof ship.owner === 'string' && playerColors[ship.owner]
              ? PLAYER_COLORS[playerColors[ship.owner]!] ?? 'var(--text-muted)'
              : undefined;
            groupMap.set(key, { ship, isNpc, type, shipColor, count: 1 });
          }
        }
        const groups = Array.from(groupMap.values());
        const groupSizes = groups.map((g) => getShipSize(g.type, BASE_SHIP_SIZE));
        const totalW = groupSizes.reduce((a, b) => a + b, 0) + Math.max(0, groups.length - 1) * SHIP_GAP;
        let cx = center.x - totalW / 2;
        return groups.map((g, i) => {
          const sz = groupSizes[i];
          const sx = cx + sz / 2;
          cx += sz + SHIP_GAP;
          return (
            <g key={`${g.ship.owner}:${g.type}`} className="ship-token">
              <ShipIconSvg
                shipType={g.type}
                color={g.shipColor}
                size={BASE_SHIP_SIZE}
                x={sx}
                y={shipY}
                isNpc={g.isNpc}
              />
              {g.count > 1 && (
                <text
                  x={sx + sz / 2 - 2}
                  y={shipY - sz / 2 + 8}
                  style={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    fontFamily: 'var(--font-mono)',
                    fill: '#fff',
                    textAnchor: 'end',
                    dominantBaseline: 'central',
                    pointerEvents: 'none',
                  }}
                >
                  x{g.count}
                </text>
              )}
            </g>
          );
        });
      })()}

      {/* 10. Structures — flanking the centered disc */}
      {sector.structures.hasOrbital && (
        <text
          x={center.x - hexSize * 0.22}
          y={center.y}
          style={{ fontSize: '11px', fill: 'var(--accent-blue)', textAnchor: 'middle', dominantBaseline: 'central' }}
        >
          O
        </text>
      )}
      {sector.structures.hasMonolith && (
        <text
          x={center.x + hexSize * 0.22}
          y={center.y}
          style={{ fontSize: '11px', fill: 'var(--accent-green)', textAnchor: 'middle', dominantBaseline: 'central' }}
        >
          M
        </text>
      )}

      {/* 11. Warp portal */}
      {sector.hasWarpPortal && (
        <text
          x={center.x}
          y={center.y + hexSize * 0.38}
          style={{ fontSize: '9px', fill: 'var(--accent-blue)', textAnchor: 'middle', dominantBaseline: 'central', fontWeight: 'bold' }}
        >
          WP
        </text>
      )}
    </g>
  );
});
