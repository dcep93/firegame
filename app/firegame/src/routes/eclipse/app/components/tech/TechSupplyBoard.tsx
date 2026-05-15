import { useEffect, useCallback } from 'react';
import { TECHS_BY_ID, MILITARY_TECHS, GRID_TECHS, NANO_TECHS } from '@eclipse/shared';
import type { TechTrayState, TechTraySlot } from '@eclipse/shared';
import { TechTileCard } from './TechTileCard';
import type { EnrichedTech, QueueEntry, RareTrackOption, TrackKey } from '../../hooks/useResearchFlow';

interface TechSupplyBoardProps {
  techTray: TechTrayState;
  onClose: () => void;
  /** Research mode — makes tiles clickable */
  researchMode?: {
    availableTechs: { category: string; color: string; discount: number; techs: EnrichedTech[] }[];
    scienceAvailable: number;
    queueFull: boolean;
    queue: QueueEntry[];
    maxActivations: number;
    onSelectTech: (techId: string) => void;
    onRemoveFromQueue: (index: number) => void;
    onConfirm: () => void;
    onCancel: () => void;
    // Rare tech track picker
    pendingRareTech: string | null;
    selectTrackForRare: (track: TrackKey) => void;
    cancelRarePicker: () => void;
    rareTrackOptions: RareTrackOption[] | null;
  };
}

// All 8 techs per non-rare track, sorted by trackPosition
const TRACK_TECHS = {
  military: [...MILITARY_TECHS].sort((a, b) => (a.trackPosition ?? 0) - (b.trackPosition ?? 0)),
  grid: [...GRID_TECHS].sort((a, b) => (a.trackPosition ?? 0) - (b.trackPosition ?? 0)),
  nano: [...NANO_TECHS].sort((a, b) => (a.trackPosition ?? 0) - (b.trackPosition ?? 0)),
} as const;

type TrackCategory = 'military' | 'grid' | 'nano';

const TRACK_CATEGORIES: { key: TrackCategory; label: string }[] = [
  { key: 'military', label: 'Military' },
  { key: 'grid', label: 'Grid' },
  { key: 'nano', label: 'Nano' },
];

const TRACK_COLORS: Record<TrackKey, string> = {
  military: 'var(--tech-military)',
  grid: 'var(--tech-grid)',
  nano: 'var(--tech-nano)',
};

const TRACK_LABELS: Record<TrackKey, string> = {
  military: 'Military',
  grid: 'Grid',
  nano: 'Nano',
};

function buildSlotMap(slots: readonly TechTraySlot[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const s of slots) map.set(s.techId, s.count);
  return map;
}

export function TechSupplyBoard({ techTray, onClose, researchMode }: TechSupplyBoardProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (researchMode?.pendingRareTech) {
        researchMode.cancelRarePicker();
      } else {
        onClose();
      }
    }
  }, [onClose, researchMode]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Build lookup maps for each track category
  const slotMaps = {
    military: buildSlotMap(techTray.military),
    grid: buildSlotMap(techTray.grid),
    nano: buildSlotMap(techTray.nano),
  };

  // In research mode, build a lookup: techId → EnrichedTech
  const researchLookup = new Map<string, EnrichedTech>();
  if (researchMode) {
    for (const group of researchMode.availableTechs) {
      for (const tech of group.techs) {
        researchLookup.set(tech.techId, tech);
      }
    }
  }

  // Sort rare by minCost
  const sortedRare = [...techTray.rare].sort((a, b) => {
    const defA = TECHS_BY_ID[a.techId];
    const defB = TECHS_BY_ID[b.techId];
    if (!defA || !defB) return 0;
    return defA.minCost - defB.minCost;
  });

  // Helper: get research props for a tile
  function getResearchProps(techId: string, count?: number) {
    if (!researchMode) return {};
    const isQueued = researchMode.queue.some(e => e.techId === techId);
    const enriched = researchLookup.get(techId);
    // Queued tiles: clickable (to deselect) + selected highlight
    if (isQueued) {
      return {
        computedCost: enriched?.computedCost,
        onClick: () => researchMode!.onSelectTech(techId),
        selected: true,
      };
    }
    if (!enriched || count === undefined || count <= 0) {
      return { disabled: true };
    }
    const tooExpensive = enriched.computedCost > researchMode.scienceAvailable;
    return {
      computedCost: enriched.computedCost,
      onClick: () => researchMode.onSelectTech(techId),
      disabled: tooExpensive || researchMode.queueFull,
    };
  }

  const pendingDef = researchMode?.pendingRareTech
    ? TECHS_BY_ID[researchMode.pendingRareTech]
    : null;

  return (
    <div
      className="tech-supply-overlay"
      onClick={(e) => {
        // Don't dismiss on backdrop click during research — too easy to accidentally cancel
        if (e.target === e.currentTarget && !researchMode) onClose();
      }}
    >
      <div className="tech-supply-board">
        <div className="tech-supply-board__header">
          <span className="tech-supply-board__title">
            {researchMode ? 'Select Technology' : 'Technology Supply'}
          </span>
          {researchMode ? (
            <button
              onClick={researchMode.onCancel}
              style={{
                padding: '6px 18px',
                borderRadius: '4px',
                border: 'none',
                background: '#6b2035',
                color: '#ffd0d0',
                fontWeight: 'bold',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          ) : (
            <button className="tech-supply-board__close" onClick={onClose}>
              ✕
            </button>
          )}
        </div>

        {/* Research mode: info bar with discounts + science + queue + confirm */}
        {researchMode && (
          <div style={{
            marginBottom: 'var(--spacing-md)',
            padding: 'var(--spacing-sm)',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--border-radius)',
            fontSize: '11px',
          }}>
            {/* Discounts + science */}
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap', marginBottom: '8px' }}>
              {researchMode.availableTechs.map(group => (
                <span key={group.category} style={{ color: group.color }}>
                  {group.category}: <span style={{ fontWeight: 'bold' }}>-{group.discount}</span>
                </span>
              ))}
              <span style={{ marginLeft: 'auto', color: 'var(--resource-science)', fontWeight: 'bold' }}>
                Science: {researchMode.scienceAvailable}
              </span>
            </div>

            {/* Queue slots + confirm */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              paddingTop: '8px',
              borderTop: '1px solid var(--border-color)',
            }}>
              <div style={{ display: 'flex', gap: '6px', flex: 1, flexWrap: 'wrap' }}>
                {Array.from({ length: researchMode.maxActivations }, (_, i) => {
                  const entry = researchMode!.queue[i];
                  const techId = entry?.techId;
                  const def = techId ? TECHS_BY_ID[techId] : null;
                  const enriched = techId ? researchLookup.get(techId) : null;
                  return techId && def ? (
                    <span
                      key={i}
                      onClick={() => researchMode!.onSelectTech(techId)}
                      style={{
                        padding: '3px 10px',
                        background: 'var(--bg-primary)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '4px',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        fontSize: '11px',
                      }}
                      title="Click to deselect"
                    >
                      {def.name}
                      {entry.trackChoice && (
                        <span style={{
                          color: TRACK_COLORS[entry.trackChoice],
                          marginLeft: '4px',
                          fontSize: '10px',
                        }}>
                          [{TRACK_LABELS[entry.trackChoice]}]
                        </span>
                      )}
                      {enriched && (
                        <span style={{ color: 'var(--accent-green)', marginLeft: '4px' }}>
                          ({enriched.computedCost})
                        </span>
                      )}
                      {' '}✕
                    </span>
                  ) : (
                    <span
                      key={i}
                      style={{
                        padding: '3px 10px',
                        border: '1px dashed var(--border-color)',
                        borderRadius: '4px',
                        color: 'var(--text-muted)',
                        fontSize: '11px',
                      }}
                    >
                      {researchMode!.maxActivations > 1 ? `Slot ${i + 1}` : 'Select a tech'}
                    </span>
                  );
                })}
              </div>
              <button
                disabled={researchMode.queue.length === 0}
                onClick={researchMode.onConfirm}
                style={{
                  padding: '6px 18px',
                  borderRadius: '4px',
                  border: 'none',
                  background: researchMode.queue.length > 0 ? '#1a7a42' : 'var(--bg-primary)',
                  color: researchMode.queue.length > 0 ? '#e0ffe0' : 'var(--text-muted)',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  cursor: researchMode.queue.length > 0 ? 'pointer' : 'default',
                  whiteSpace: 'nowrap',
                }}
              >
                Confirm{researchMode.maxActivations > 1 ? ` (${researchMode.queue.length})` : ''}
              </button>
            </div>
          </div>
        )}

        {/* Non-rare tracks: 3 rows × 8 columns showing ALL positions */}
        {TRACK_CATEGORIES.map(cat => {
          const trackTechs = TRACK_TECHS[cat.key];
          const slotMap = slotMaps[cat.key];

          return (
            <div key={cat.key} className="tech-supply-category">
              <div className={`tech-supply-category__label tech-supply-category__label--${cat.key}`}>
                {cat.label}
              </div>
              <div className="tech-supply-track">
                {trackTechs.map(tech => {
                  const count = slotMap.get(tech.id);
                  const isAvailable = count !== undefined;

                  return isAvailable ? (
                    <TechTileCard
                      key={tech.id}
                      techId={tech.id}
                      count={count}
                      {...getResearchProps(tech.id, count)}
                    />
                  ) : (
                    <div
                      key={tech.id}
                      className="tech-supply-track__empty"
                      title={`${tech.name} — not yet drawn`}
                    >
                      <img
                        className="tech-tile-card__img"
                        src={`/tech-icons/${tech.id}.svg`}
                        alt={tech.name}
                        draggable={false}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Rare techs */}
        <div className="tech-supply-category">
          <div className="tech-supply-category__label tech-supply-category__label--rare">
            Rare
          </div>
          <div className="tech-supply-category__grid">
            {sortedRare.map(slot => (
              <TechTileCard
                key={slot.techId}
                techId={slot.techId}
                count={slot.count}
                {...getResearchProps(slot.techId, slot.count)}
              />
            ))}
            {sortedRare.length === 0 && (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '4px 0' }}>
                No rare techs drawn
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Rare tech track picker modal */}
      {researchMode?.pendingRareTech && pendingDef && researchMode.rareTrackOptions && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) researchMode.cancelRarePicker();
          }}
        >
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--tech-rare)',
            borderRadius: '8px',
            padding: '16px 20px',
            minWidth: '280px',
            maxWidth: '360px',
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: 'bold',
              color: 'var(--tech-rare)',
              marginBottom: '4px',
            }}>
              {pendingDef.name}
            </div>
            <div style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginBottom: '12px',
            }}>
              Choose which research track to place this rare tech on:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {researchMode.rareTrackOptions
                .slice()
                .sort((a, b) => a.cost - b.cost)
                .map((opt, idx) => {
                  const isCheapest = idx === 0 && !opt.isFull;
                  const tooExpensive = opt.cost > researchMode!.scienceAvailable;
                  const isDisabled = opt.isFull || tooExpensive;

                  return (
                    <button
                      key={opt.track}
                      onClick={() => {
                        if (!isDisabled) researchMode!.selectTrackForRare(opt.track);
                      }}
                      disabled={isDisabled}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        border: isCheapest && !isDisabled
                          ? `2px solid ${TRACK_COLORS[opt.track]}`
                          : '1px solid var(--border-color)',
                        background: isDisabled
                          ? 'var(--bg-primary)'
                          : isCheapest
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'var(--bg-tertiary)',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        opacity: isDisabled ? 0.5 : 1,
                        textAlign: 'left',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div>
                          <span style={{
                            color: TRACK_COLORS[opt.track],
                            fontWeight: 'bold',
                            marginRight: '8px',
                          }}>
                            {TRACK_LABELS[opt.track]}
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                            {opt.trackLength} tech{opt.trackLength !== 1 ? 's' : ''} on track
                            {opt.isFull && (
                              <span style={{ color: '#ff6b6b', fontWeight: 'bold', marginLeft: '6px' }}>
                                FULL
                              </span>
                            )}
                          </span>
                        </div>
                        {!opt.isFull && (
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                            {opt.vpAfter > opt.currentVP ? (
                              <span>
                                VP: {opt.currentVP} <span style={{ color: 'var(--accent-green)' }}>+{opt.vpAfter - opt.currentVP} = {opt.vpAfter}</span>
                              </span>
                            ) : (
                              <span>
                                VP: {opt.currentVP}{opt.currentVP >= 5 ? ' (max)' : ''}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {!opt.isFull && (
                          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                            -{opt.discount}
                          </span>
                        )}
                        {!opt.isFull && (
                          <>
                            <span style={{
                              fontWeight: 'bold',
                              fontSize: '13px',
                              color: isCheapest && !isDisabled
                                ? 'var(--accent-green)'
                                : 'var(--resource-science)',
                              minWidth: '24px',
                              textAlign: 'right',
                            }}>
                              {opt.cost}
                            </span>
                            {isCheapest && !isDisabled && (
                              <span style={{
                                fontSize: '9px',
                                color: 'var(--accent-green)',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                              }}>
                                Best
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>

            <button
              onClick={researchMode.cancelRarePicker}
              style={{
                marginTop: '12px',
                width: '100%',
                padding: '6px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                background: 'transparent',
                color: 'var(--text-muted)',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
