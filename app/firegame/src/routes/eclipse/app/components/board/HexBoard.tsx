import { useMemo, useState, useCallback } from 'react';
import type { SectorDefinition, FilteredPlacedSector, ShipOnBoard } from '@eclipse/shared';
import { NpcType, ShipType } from '@eclipse/shared';
import { useGameState } from '../../hooks/useGameState';
import { useBoardTransform } from '../../hooks/useBoardTransform';
import { hexToPixel, hexPolygonPoints } from '../../services/hex-layout';
import { HexTile } from './HexTile';
import { GhostTile } from './GhostTile';
import { ShipTooltip } from './ShipTooltip';
import { getShipSize } from '../shared/ShipIcon';
import { getNpcVariant } from './ShipInspectModal';
import '../../styles/board.css';

const NPC_IDS = new Set<string>([NpcType.Ancient, NpcType.Guardian, NpcType.GCDS]);

const HEX_SIZE = 80;
const BOARD_PADDING = 200;

/** Axial direction offsets for the 6 hex neighbors */
const AXIAL_DIRS = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
] as const;

type GhostTileData = { sectorDef: SectorDefinition; position: { q: number; r: number }; rotation: number };

interface HexBoardProps {
  exploreHighlights?: Array<{ q: number; r: number }>;
  exploreGhost?: GhostTileData | null;
  completedGhostTiles?: GhostTileData[];
  colonyShipHighlights?: Array<{ q: number; r: number }>;
  buildHighlights?: Array<{ q: number; r: number }>;
  moveHighlights?: Array<{ q: number; r: number }>;
  influenceHighlights?: Array<{ q: number; r: number }>;
  claimHighlights?: Array<{ q: number; r: number }>;
  claimSelectedKeys?: Set<string>;
  onHexClick?: (position: { q: number; r: number }) => void;
  onSectorInspect?: (sector: FilteredPlacedSector) => void;
  onShipInspect?: (ship: ShipOnBoard, count: number) => void;
}

export function HexBoard({ exploreHighlights, exploreGhost, completedGhostTiles, colonyShipHighlights, buildHighlights, moveHighlights, influenceHighlights, claimHighlights, claimSelectedKeys, onHexClick, onSectorInspect, onShipInspect }: HexBoardProps = {}) {
  const { filteredState } = useGameState();
  const { transform, svgRef, handlers, wasDrag, resetView } = useBoardTransform();

  const sectors = filteredState?.board.sectors;

  // ── Ship hover tooltip state ──
  const [hoveredShip, setHoveredShip] = useState<{ ship: ShipOnBoard; x: number; y: number; count: number } | null>(null);

  const handleShipHover = useCallback((ship: ShipOnBoard, e: React.MouseEvent, count: number) => {
    setHoveredShip({ ship, x: e.clientX, y: e.clientY, count });
  }, []);

  const handleShipLeave = useCallback(() => {
    setHoveredShip(null);
  }, []);

  const handleShipClick = useCallback((ship: ShipOnBoard, count: number) => {
    setHoveredShip(null);
    onShipInspect?.(ship, count);
  }, [onShipInspect]);

  // Resolve blueprint/npc data for the hover tooltip
  const tooltipData = useMemo(() => {
    if (!hoveredShip || !filteredState) return null;
    const { ship } = hoveredShip;
    const isNpc = NPC_IDS.has(ship.owner as string);

    if (isNpc) {
      const npcVariant = getNpcVariant(ship.owner as string, filteredState.config);
      return {
        blueprint: null,
        npcVariant,
        ownerName: ship.owner === NpcType.Ancient ? 'Ancient' : ship.owner === NpcType.Guardian ? 'Guardian' : 'GCDS',
        ownerColor: 'var(--text-muted)',
      };
    }

    const playerId = ship.owner as string;
    const player = playerId === filteredState.you.id
      ? filteredState.you
      : filteredState.opponents[playerId];
    const blueprint = player?.blueprints[ship.type as keyof typeof player.blueprints] ?? null;
    const colorName = player?.color ?? '';
    const ownerColor = `var(--player-${colorName})`;
    const ownerName = playerId === filteredState.you.id
      ? 'You'
      : (filteredState.opponents[playerId]?.id ?? playerId);

    return { blueprint, npcVariant: null, ownerName, ownerColor };
  }, [hoveredShip, filteredState]);

  // Build player ID → color lookup
  const playerColors = useMemo(() => {
    if (!filteredState) return {};
    const map: Record<string, string> = {};
    map[filteredState.you.id] = filteredState.you.color;
    for (const [id, opp] of Object.entries(filteredState.opponents)) {
      map[id] = opp.color;
    }
    return map;
  }, [filteredState]);

  // Compute empty zones: hex positions adjacent to placed sectors that have no sector
  const emptyZones = useMemo(() => {
    if (!sectors) return [];
    const sectorKeys = new Set(Object.keys(sectors));
    const emptyKeys = new Set<string>();

    for (const sector of Object.values(sectors)) {
      const { q, r } = sector.position;
      for (const dir of AXIAL_DIRS) {
        const nq = q + dir.q;
        const nr = r + dir.r;
        const key = `${nq},${nr}`;
        if (!sectorKeys.has(key)) {
          emptyKeys.add(key);
        }
      }
    }

    return Array.from(emptyKeys).map(key => {
      const parts = key.split(',');
      return { q: Number(parts[0]), r: Number(parts[1]) };
    });
  }, [sectors]);

  // Calculate viewBox from all hex positions
  const { hexes, viewBox } = useMemo(() => {
    if (!sectors) return { hexes: [], viewBox: '-400 -400 800 800' };

    const entries = Object.entries(sectors);
    const positions = entries.map(([, s]) => hexToPixel(s.position, HEX_SIZE));
    const emptyPositions = emptyZones.map(z => hexToPixel(z, HEX_SIZE));
    const all = [...positions, ...emptyPositions];

    if (all.length === 0) return { hexes: entries, viewBox: '-400 -400 800 800' };

    const minX = Math.min(...all.map(p => p.x)) - BOARD_PADDING;
    const minY = Math.min(...all.map(p => p.y)) - BOARD_PADDING;
    const maxX = Math.max(...all.map(p => p.x)) + BOARD_PADDING;
    const maxY = Math.max(...all.map(p => p.y)) + BOARD_PADDING;

    return {
      hexes: entries,
      viewBox: `${minX} ${minY} ${maxX - minX} ${maxY - minY}`,
    };
  }, [sectors, emptyZones]);

  // Build all highlight key sets in a single memo to avoid cascading invalidations
  const {
    highlightKeys, colonyShipHighlightKeys, buildHighlightKeys,
    moveHighlightKeys, influenceHighlightKeys, claimHighlightKeys,
    extraHighlights,
  } = useMemo(() => {
    const toSet = (arr?: Array<{ q: number; r: number }>) =>
      arr && arr.length > 0 ? new Set(arr.map(p => `${p.q},${p.r}`)) : new Set<string>();

    const hk = toSet(exploreHighlights);
    const emptyKeys = hk.size > 0 ? new Set(emptyZones.map(z => `${z.q},${z.r}`)) : new Set<string>();
    const extra = hk.size > 0
      ? (exploreHighlights ?? []).filter(p => !emptyKeys.has(`${p.q},${p.r}`))
      : [];

    return {
      highlightKeys: hk,
      colonyShipHighlightKeys: toSet(colonyShipHighlights),
      buildHighlightKeys: toSet(buildHighlights),
      moveHighlightKeys: toSet(moveHighlights),
      influenceHighlightKeys: toSet(influenceHighlights),
      claimHighlightKeys: toSet(claimHighlights),
      extraHighlights: extra,
    };
  }, [exploreHighlights, colonyShipHighlights, buildHighlights, moveHighlights, influenceHighlights, claimHighlights, emptyZones]);

  return (
    <>
    <svg
      ref={svgRef}
      className="hex-board"
      viewBox={viewBox}
      {...handlers}
      style={{
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
        transformOrigin: '0 0',
      }}
    >
      {/* Empty zone indicators */}
      {emptyZones.map((coord) => {
        const key = `${coord.q},${coord.r}`;
        const isHighlighted = highlightKeys.has(key);
        const pos = hexToPixel(coord, HEX_SIZE);

        if (isHighlighted) {
          return (
            <polygon
              key={`explore-${key}`}
              points={hexPolygonPoints(pos, HEX_SIZE)}
              className="hex-tile--explore-target"
              onClick={(e) => {
                e.stopPropagation();
                if (!wasDrag() && onHexClick) {
                  onHexClick(coord);
                }
              }}
            />
          );
        }

        return (
          <polygon
            key={`empty-${key}`}
            points={hexPolygonPoints(pos, HEX_SIZE)}
            className="hex-outline hex-tile--empty"
          />
        );
      })}

      {/* Extra explore highlights (positions only adjacent to ghost-placed tiles) */}
      {extraHighlights.map((coord) => {
        const key = `${coord.q},${coord.r}`;
        const pos = hexToPixel(coord, HEX_SIZE);
        return (
          <polygon
            key={`explore-extra-${key}`}
            points={hexPolygonPoints(pos, HEX_SIZE)}
            className="hex-tile--explore-target"
            onClick={(e) => {
              e.stopPropagation();
              if (!wasDrag() && onHexClick) {
                onHexClick(coord);
              }
            }}
          />
        );
      })}

      {/* Placed sectors */}
      {hexes.map(([key, sector]) => (
        <HexTile key={key} sector={sector} hexSize={HEX_SIZE} playerColors={playerColors} />
      ))}

      {/* Sector inspect click overlays — only when no action highlights are active */}
      {onSectorInspect && !onHexClick &&
        highlightKeys.size === 0 && colonyShipHighlightKeys.size === 0 &&
        buildHighlightKeys.size === 0 && moveHighlightKeys.size === 0 &&
        influenceHighlightKeys.size === 0 && claimHighlightKeys.size === 0 &&
        hexes.map(([key, sector]) => {
          const pos = hexToPixel(sector.position, HEX_SIZE);
          return (
            <polygon
              key={`inspect-${key}`}
              points={hexPolygonPoints(pos, HEX_SIZE)}
              className="hex-tile--inspect"
              onClick={(e) => {
                e.stopPropagation();
                if (!wasDrag()) onSectorInspect(sector);
              }}
            />
          );
        })
      }

      {/* Colony ship highlight overlays */}
      {colonyShipHighlightKeys.size > 0 && hexes.map(([key, sector]) => {
        if (!colonyShipHighlightKeys.has(key)) return null;
        const pos = hexToPixel(sector.position, HEX_SIZE);
        return (
          <polygon
            key={`colony-ship-${key}`}
            points={hexPolygonPoints(pos, HEX_SIZE)}
            className="hex-tile--colony-ship-target"
          />
        );
      })}

      {/* Build target highlight overlays */}
      {buildHighlightKeys.size > 0 && hexes.map(([key, sector]) => {
        if (!buildHighlightKeys.has(key)) return null;
        const pos = hexToPixel(sector.position, HEX_SIZE);
        return (
          <polygon
            key={`build-${key}`}
            points={hexPolygonPoints(pos, HEX_SIZE)}
            className="hex-tile--build-target"
            onClick={(e) => {
              e.stopPropagation();
              if (!wasDrag() && onHexClick) {
                onHexClick(sector.position);
              }
            }}
          />
        );
      })}

      {/* Move target highlight overlays */}
      {moveHighlightKeys.size > 0 && hexes.map(([key, sector]) => {
        if (!moveHighlightKeys.has(key)) return null;
        const pos = hexToPixel(sector.position, HEX_SIZE);
        return (
          <polygon
            key={`move-${key}`}
            points={hexPolygonPoints(pos, HEX_SIZE)}
            className="hex-tile--move-target"
            onClick={(e) => {
              e.stopPropagation();
              if (!wasDrag() && onHexClick) {
                onHexClick(sector.position);
              }
            }}
          />
        );
      })}

      {/* Influence target highlight overlays */}
      {influenceHighlightKeys.size > 0 && hexes.map(([key, sector]) => {
        if (!influenceHighlightKeys.has(key)) return null;
        const pos = hexToPixel(sector.position, HEX_SIZE);
        return (
          <polygon
            key={`influence-${key}`}
            points={hexPolygonPoints(pos, HEX_SIZE)}
            className="hex-tile--influence-target"
            onClick={(e) => {
              e.stopPropagation();
              if (!wasDrag() && onHexClick) {
                onHexClick(sector.position);
              }
            }}
          />
        );
      })}

      {/* Claim sector highlight overlays (post-combat influence choice) */}
      {claimHighlightKeys.size > 0 && hexes.map(([key, sector]) => {
        if (!claimHighlightKeys.has(key)) return null;
        const pos = hexToPixel(sector.position, HEX_SIZE);
        const isSelected = claimSelectedKeys?.has(key) ?? false;
        return (
          <polygon
            key={`claim-${key}`}
            points={hexPolygonPoints(pos, HEX_SIZE)}
            className={isSelected ? 'hex-tile--claim-selected' : 'hex-tile--claim-available'}
            onClick={(e) => {
              e.stopPropagation();
              if (!wasDrag() && onHexClick) {
                onHexClick(sector.position);
              }
            }}
          />
        );
      })}

      {/* Ship interaction overlays — rendered ON TOP of inspect overlays so ships are clickable */}
      {hexes.map(([, sector]) => {
        if (sector.ships.length === 0) return null;
        const pos = hexToPixel(sector.position, HEX_SIZE);
        const shipY = pos.y + HEX_SIZE * 0.6;
        const BASE_HIT = 26;
        const HIT_GAP = 4;
        // Group ships by owner+type to match HexTile layout
        const groupMap = new Map<string, { ship: ShipOnBoard; type: string; count: number }>();
        for (const ship of sector.ships) {
          const isNpc = NPC_IDS.has(ship.owner as string);
          const type = isNpc ? (ship.owner as string) : ship.type;
          const key = `${ship.owner}:${type}`;
          if (!groupMap.has(key)) {
            groupMap.set(key, { ship, type, count: 1 });
          } else {
            groupMap.get(key)!.count++;
          }
        }
        const groups = Array.from(groupMap.values());
        const groupSizes = groups.map((g) => getShipSize(g.type, BASE_HIT));
        const totalW = groupSizes.reduce((a, b) => a + b, 0) + Math.max(0, groups.length - 1) * HIT_GAP;
        let cx = pos.x - totalW / 2;
        return groups.map((g, i) => {
          const sz = groupSizes[i];
          const sx = cx + sz / 2;
          cx += sz + HIT_GAP;
          return (
            <rect
              key={`ship-hit-${g.ship.owner}:${g.type}`}
              x={sx - sz / 2}
              y={shipY - sz / 2}
              width={sz}
              height={sz}
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => handleShipHover(g.ship, e, g.count)}
              onMouseLeave={handleShipLeave}
              onClick={(e) => { e.stopPropagation(); if (!wasDrag()) handleShipClick(g.ship, g.count); }}
            />
          );
        });
      })}

      {/* Completed ghost tiles (multi-activation, e.g. Planta) */}
      {completedGhostTiles?.map((ghost, i) => (
        <GhostTile
          key={`completed-ghost-${i}`}
          sectorDef={ghost.sectorDef}
          position={ghost.position}
          rotation={ghost.rotation}
          hexSize={HEX_SIZE}
          committed
        />
      ))}

      {/* Ghost tile preview (current activation being reviewed) */}
      {exploreGhost && (
        <>
          <GhostTile
            sectorDef={exploreGhost.sectorDef}
            position={exploreGhost.position}
            rotation={exploreGhost.rotation}
            hexSize={HEX_SIZE}
          />
          {onSectorInspect && (
            <polygon
              points={hexPolygonPoints(hexToPixel(exploreGhost.position, HEX_SIZE), HEX_SIZE)}
              className="hex-tile--inspect"
              onClick={(e) => {
                e.stopPropagation();
                if (!wasDrag()) {
                  const def = exploreGhost.sectorDef;
                  const synth: FilteredPlacedSector = {
                    sectorId: def.id,
                    position: exploreGhost.position,
                    rotation: exploreGhost.rotation,
                    influenceDisc: null,
                    populations: [],
                    ships: [],
                    structures: { hasOrbital: false, orbitalPopulation: null, hasMonolith: false },
                    discoveryTile: null,
                    hasUnclaimedDiscovery: def.hasDiscovery,
                    ancients: def.ancientCount ?? (def.hasAncient ? 1 : 0),
                    hasWarpPortal: false,
                  };
                  onSectorInspect(synth);
                }
              }}
            />
          )}
        </>
      )}

      {/* Reset view button */}
      <foreignObject x="-380" y="-380" width="60" height="30">
        <button
          onClick={resetView}
          style={{
            fontSize: '10px',
            padding: '4px 8px',
            background: 'var(--bg-tertiary)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-color)',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </foreignObject>
    </svg>

    {/* Ship hover tooltip — rendered as fixed HTML outside SVG */}
    {hoveredShip && tooltipData && (
      <ShipTooltip
        ship={hoveredShip.ship}
        blueprint={tooltipData.blueprint}
        npcVariant={tooltipData.npcVariant}
        ownerName={tooltipData.ownerName}
        ownerColor={tooltipData.ownerColor}
        x={hoveredShip.x}
        y={hoveredShip.y}
        count={hoveredShip.count}
      />
    )}
    </>
  );
}
