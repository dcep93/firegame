import type { SectorDefinition, PopulationSquare, FilteredPlacedSector } from '@eclipse/shared';
import { PopulationSquareType } from '@eclipse/shared';
import { Button } from '../shared/Button';
import { TilePreview } from '../board/TilePreview';
import { RotateButton } from './RotateButton';

const RESOURCE_LABELS: Record<string, string> = {
  [PopulationSquareType.Money]: 'Money',
  [PopulationSquareType.Science]: 'Science',
  [PopulationSquareType.Materials]: 'Materials',
  [PopulationSquareType.Wild]: 'Wild',
};

const RESOURCE_COLORS: Record<string, string> = {
  [PopulationSquareType.Money]: 'var(--resource-money)',
  [PopulationSquareType.Science]: 'var(--resource-science)',
  [PopulationSquareType.Materials]: 'var(--resource-materials)',
  [PopulationSquareType.Wild]: 'var(--resource-wild)',
};

const RESOURCE_ICONS: Record<string, string> = {
  [PopulationSquareType.Money]: '\u{1F4B0}',
  [PopulationSquareType.Science]: '\u{1F52C}',
  [PopulationSquareType.Materials]: '\u{2692}\uFE0F',
  [PopulationSquareType.Wild]: '\u{2B50}',
};

interface ExploreTileChoicePanelProps {
  tiles: Array<{ index: 0 | 1; sectorId: string; def: SectorDefinition }>;
  selectedTileIndex: 0 | 1 | null;
  selectedDef: SectorDefinition | null;
  rotation: number;
  takeInfluence: boolean;
  validRotations: Set<number>;
  isDraco?: boolean;
  onSelectTile: (index: 0 | 1) => void;
  onSetRotation: (rot: number) => void;
  onSetTakeInfluence: (val: boolean) => void;
  onConfirmPlace: () => void;
  onConfirmDiscard: () => void;
  onTileInspect?: (sector: FilteredPlacedSector) => void;
}

export function ExploreTileChoicePanel({
  tiles,
  selectedTileIndex,
  selectedDef,
  rotation,
  takeInfluence,
  validRotations,
  onSelectTile,
  onSetRotation,
  onSetTakeInfluence,
  isDraco,
  onConfirmPlace,
  onConfirmDiscard,
  onTileInspect,
}: ExploreTileChoicePanelProps) {
  const hasAncients = selectedDef ? (selectedDef.hasAncient || (selectedDef.ancientCount ?? 0) > 0) : false;
  const showInfluenceToggle = !hasAncients || isDraco;

  return (
    <div style={{
      padding: 'var(--spacing-md)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-sm)',
      height: '100%',
    }}>
      <h3 style={{ color: 'var(--accent-yellow)', margin: 0, fontSize: '16px' }}>
        Choose a Tile
      </h3>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
        You drew 2 tiles. Select one to place or discard.
      </p>

      {/* Tile cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
        {tiles.map(tile => {
          const isSelected = tile.index === selectedTileIndex;
          return (
            <TileCard
              key={tile.index}
              def={tile.def}
              sectorId={tile.sectorId}
              isSelected={isSelected}
              isExpanded={isSelected}
              onClick={() => onSelectTile(tile.index)}
            />
          );
        })}
      </div>

      {/* Zoomed tile preview with rotation controls inside (shown when a tile is selected) */}
      {selectedDef && (
        <div style={{
          padding: 'var(--spacing-md)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--border-radius)',
          border: '1px solid var(--border-color)',
        }}>
          <RotateButton
            rotation={rotation}
            validRotations={validRotations}
            onSetRotation={onSetRotation}
          />
          <TilePreview sectorDef={selectedDef} rotation={rotation} maxWidth={240} onInspect={onTileInspect} />
        </div>
      )}

      {/* Influence + actions (shown when a tile is selected) */}
      {selectedDef && (
        <>
          {/* Influence toggle — hidden if ancients present (unless Draco) */}
          {showInfluenceToggle && (
            <div>
              <div style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: 'var(--spacing-xs)',
              }}>
                Influence
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => onSetTakeInfluence(true)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 'var(--border-radius)',
                    border: takeInfluence ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
                    background: takeInfluence ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
                    color: takeInfluence ? '#fff' : 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  Place Disc
                </button>
                <button
                  onClick={() => onSetTakeInfluence(false)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 'var(--border-radius)',
                    border: !takeInfluence ? '2px solid var(--accent-yellow)' : '1px solid var(--border-color)',
                    background: !takeInfluence ? 'rgba(255, 193, 7, 0.2)' : 'var(--bg-tertiary)',
                    color: !takeInfluence ? 'var(--accent-yellow)' : 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  No Disc
                </button>
              </div>
            </div>
          )}
          {hasAncients && !isDraco && (
            <div style={{
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              background: 'rgba(255, 74, 106, 0.1)',
              borderRadius: 'var(--border-radius)',
              color: 'var(--accent-red)',
              fontSize: '11px',
            }}>
              Cannot place disc — sector has ancients
            </div>
          )}
          {hasAncients && isDraco && (
            <div style={{
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              background: 'rgba(74, 222, 128, 0.1)',
              borderRadius: 'var(--border-radius)',
              color: 'var(--accent-green, #4ade80)',
              fontSize: '11px',
            }}>
              Draco coexists with ancients — disc allowed
            </div>
          )}

          {/* Action buttons */}
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-sm)',
            marginTop: 'var(--spacing-xs)',
          }}>
            <Button
              variant="primary"
              size="sm"
              disabled={!validRotations.has(rotation)}
              onClick={onConfirmPlace}
              style={{ flex: 1 }}
            >
              Place Tile
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={onConfirmDiscard}
              style={{ flex: 1 }}
            >
              Discard
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Tile Card ──────────────────────────────────────────── */

function TileCard({
  def,
  sectorId,
  isSelected,
  isExpanded,
  onClick,
}: {
  def: SectorDefinition;
  sectorId: string;
  isSelected: boolean;
  isExpanded: boolean;
  onClick: () => void;
}) {
  const ancientCount = def.ancientCount ?? (def.hasAncient ? 1 : 0);
  const wormholeCount = def.wormholes.edges.length;
  const halfWormholeCount = def.wormholes.halfWormholes?.length ?? 0;

  return (
    <div
      style={{
        padding: 'var(--spacing-sm)',
        background: isSelected ? 'rgba(255, 193, 7, 0.12)' : 'var(--bg-tertiary)',
        border: `2px solid ${isSelected ? 'var(--accent-yellow)' : 'var(--border-color)'}`,
        borderRadius: 'var(--border-radius)',
        cursor: 'pointer',
        transition: 'background var(--transition-fast)',
      }}
      onClick={onClick}
    >
      {/* Header row: name + VP + sector ID */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '14px' }}>
            {def.name}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            #{sectorId}
          </span>
        </div>
        {def.vpValue > 0 && (
          <span style={{
            color: '#000',
            background: 'var(--accent-yellow)',
            fontWeight: 'bold',
            fontSize: '12px',
            padding: '1px 6px',
            borderRadius: '8px',
          }}>
            {def.vpValue} VP
          </span>
        )}
      </div>

      {/* Quick badges row (always shown) */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: isExpanded ? '6px' : 0 }}>
        {ancientCount > 0 && (
          <Badge color="var(--accent-red)" bg="rgba(255, 74, 106, 0.15)">
            {ancientCount > 1 ? `${ancientCount} Ancients` : 'Ancient'}
          </Badge>
        )}
        {def.hasDiscovery && (
          <Badge color="var(--accent-yellow)" bg="rgba(255, 204, 74, 0.15)">
            Discovery
          </Badge>
        )}
        {def.hasArtifact && (
          <Badge color="var(--accent-purple, #b388ff)" bg="rgba(179, 136, 255, 0.15)">
            Artifact
          </Badge>
        )}
        <Badge color="var(--text-muted)" bg="rgba(255,255,255,0.06)">
          {wormholeCount} WH{halfWormholeCount > 0 ? ` + ${halfWormholeCount} half` : ''}
        </Badge>
      </div>

      {/* Expanded detail section */}
      {isExpanded && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          paddingTop: '6px',
          borderTop: '1px solid var(--border-color)',
        }}>
          {/* Resources */}
          {def.populationSquares.length > 0 ? (
            <ResourceList squares={def.populationSquares} />
          ) : (
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No population squares
            </div>
          )}

          {/* Wormhole edges */}
          <WormholeDetail edges={def.wormholes.edges as number[]} halfEdges={(def.wormholes.halfWormholes ?? []) as number[]} />

          {/* Special features summary */}
          {ancientCount > 0 && (
            <div style={{ fontSize: '11px', color: 'var(--accent-red)', lineHeight: 1.4 }}>
              {ancientCount} Ancient ship{ancientCount > 1 ? 's' : ''} guard this sector.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Badge ──────────────────────────────────────────────── */

function Badge({ color, bg, children }: { color: string; bg: string; children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: '10px',
      fontWeight: 600,
      color,
      background: bg,
      padding: '1px 6px',
      borderRadius: '6px',
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

/* ─── Resource List ──────────────────────────────────────── */

function ResourceList({ squares }: { squares: readonly PopulationSquare[] }) {
  // Group by type, tracking advanced count
  const groups: Record<string, { total: number; advanced: number }> = {};
  for (const sq of squares) {
    const g = groups[sq.type] ?? { total: 0, advanced: 0 };
    g.total++;
    if (sq.advanced) g.advanced++;
    groups[sq.type] = g;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <div style={{
        fontSize: '10px',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        Resources
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {Object.entries(groups).map(([type, { total, advanced }]) => (
          <div key={type} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '12px',
            color: RESOURCE_COLORS[type] ?? 'var(--text-primary)',
          }}>
            <span>{RESOURCE_ICONS[type] ?? ''}</span>
            <span style={{ fontWeight: 600 }}>
              {total} {RESOURCE_LABELS[type] ?? type}
            </span>
            {advanced > 0 && (
              <span style={{
                fontSize: '9px',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-color)',
                borderRadius: '3px',
                padding: '0 3px',
              }}>
                {advanced} adv
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Wormhole Detail ────────────────────────────────────── */

function WormholeDetail({ edges, halfEdges }: { edges: number[]; halfEdges: number[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <div style={{
        fontSize: '10px',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        Wormholes
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
        {/* Mini hex diagram showing which edges have wormholes */}
        <MiniHexWormholes edges={edges} halfEdges={halfEdges} />
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '4px' }}>
          Edges: {edges.sort((a, b) => a - b).join(', ')}
          {halfEdges.length > 0 && (
            <span style={{ color: 'var(--text-muted)' }}>
              {' '}| Half: {halfEdges.sort((a, b) => a - b).join(', ')}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

/* ─── Mini Hex SVG ───────────────────────────────────────── */

function MiniHexWormholes({ edges, halfEdges }: { edges: number[]; halfEdges: number[] }) {
  const size = 16;
  const cx = size;
  const cy = size;

  // Hex corners (pointy-top orientation)
  const corners = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return { x: cx + size * Math.cos(angle), y: cy + size * Math.sin(angle) };
  });

  const edgeSet = new Set(edges);
  const halfSet = new Set(halfEdges);

  return (
    <svg width={size * 2} height={size * 2} viewBox={`0 0 ${size * 2} ${size * 2}`}>
      {/* Hex outline */}
      <polygon
        points={corners.map(c => `${c.x},${c.y}`).join(' ')}
        fill="none"
        stroke="var(--border-color)"
        strokeWidth="1"
      />
      {/* Wormhole edges highlighted */}
      {corners.map((corner, i) => {
        const next = corners[(i + 1) % 6]!;
        const hasFull = edgeSet.has(i);
        const hasHalf = halfSet.has(i);
        if (!hasFull && !hasHalf) return null;
        return (
          <line
            key={i}
            x1={corner.x}
            y1={corner.y}
            x2={next.x}
            y2={next.y}
            stroke={hasFull ? 'var(--accent-blue)' : 'var(--accent-yellow)'}
            strokeWidth={hasFull ? 2.5 : 1.5}
            strokeDasharray={hasHalf && !hasFull ? '2,2' : undefined}
          />
        );
      })}
    </svg>
  );
}
