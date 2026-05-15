import { useState, useEffect, useCallback } from 'react';
import { TECHS_BY_ID } from '@eclipse/shared';
import { useGameState } from '../../hooks/useGameState';
import { TechTileCard } from '../tech/TechTileCard';

const TRACK_VP = [0, 0, 0, 0, 1, 2, 3, 5]; // VP for having 0–7 techs
const TRACK_DISCOUNT = [0, 1, 2, 3, 4, 6, 8]; // discount per slot on physical board
const TRACK_SIZE = 7;

const CATEGORIES = [
  { key: 'military' as const, label: 'MIL', fullLabel: 'Military', color: 'var(--tech-military)' },
  { key: 'grid' as const, label: 'GRID', fullLabel: 'Grid', color: 'var(--tech-grid)' },
  { key: 'nano' as const, label: 'NANO', fullLabel: 'Nano', color: 'var(--tech-nano)' },
] as const;

function sortTechs(techs: readonly string[]) {
  return [...techs].sort((a, b) => {
    const da = TECHS_BY_ID[a], db = TECHS_BY_ID[b];
    if (!da || !db) return 0;
    return (da.minCost - db.minCost) || (da.maxCost - db.maxCost);
  });
}

/** Compact sidebar track row */
export function TrackCategory({ label, color, techs }: {
  label: string;
  color: string;
  techs: readonly string[];
}) {
  const count = techs.length;
  const vp = TRACK_VP[count] ?? 0;
  const sorted = sortTechs(techs);

  return (
    <div className="research-track">
      <div className="research-track__label" style={{ background: color }}>
        <span>{label}</span>
      </div>
      <div className="research-track__slots">
        {Array.from({ length: TRACK_SIZE }, (_, i) => {
          const techId = sorted[i];
          const isFilled = i < count && techId;
          const slotVp = TRACK_VP[i + 1] ?? 0;
          const showVp = i >= 3;
          return (
            <div key={i} className="research-track__slot">
              {isFilled ? (
                <TechTileCard techId={techId} />
              ) : (
                <div className="research-track__empty" style={{ borderColor: color }}>
                  <span className="research-track__discount">
                    {TRACK_DISCOUNT[i] ? <>&minus;{TRACK_DISCOUNT[i]}</> : ''}
                  </span>
                </div>
              )}
              {showVp && (
                <div className={`research-track__vp${i < count ? ' research-track__vp--earned' : ''}`}>
                  {slotVp}{'\u2605'}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="research-track__vp-total" style={{ borderColor: color }}>
        <span className="research-track__vp-total-value">{vp}</span>
        <span className="research-track__vp-total-star">{'\u2605'}</span>
      </div>
    </div>
  );
}

/** Yellow VP shield badge — matches physical game's yellow pentagon shields */
function VpShield({ value, earned }: { value: number; earned: boolean }) {
  return (
    <div style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      marginTop: '4px',
    }}>
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '4px 4px 4px 14px',
        background: earned ? '#d4a017' : 'rgba(180, 160, 30, 0.15)',
        border: earned ? '2px solid #f0c030' : '1px solid rgba(180, 160, 30, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
      }}>
        <span style={{
          fontSize: '13px',
          fontWeight: 'bold',
          color: earned ? '#1a1a2e' : 'rgba(255,255,255,0.25)',
          fontFamily: 'var(--font-mono)',
          lineHeight: 1,
        }}>
          {value}
        </span>
      </div>
    </div>
  );
}

/** Full overlay board for the player's research tracks */
export function ResearchBoardOverlay({ techTracks, onClose }: {
  techTracks: { military: readonly string[]; grid: readonly string[]; nano: readonly string[] };
  onClose: () => void;
}) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const totalVP = CATEGORIES.reduce(
    (sum, cat) => sum + (TRACK_VP[techTracks[cat.key].length] ?? 0),
    0,
  );
  const totalTechs = CATEGORIES.reduce(
    (sum, cat) => sum + techTracks[cat.key].length,
    0,
  );

  return (
    <div
      className="tech-supply-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="tech-supply-board" style={{ maxWidth: '900px' }}>
        <div className="tech-supply-board__header">
          <span className="tech-supply-board__title">My Research</span>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--accent-yellow)', fontWeight: 'bold' }}>
              {totalTechs} tech{totalTechs !== 1 ? 's' : ''} · {totalVP}{'\u2605'}
            </span>
            <button className="tech-supply-board__close" onClick={onClose}>✕</button>
          </div>
        </div>

        {CATEGORIES.map(cat => {
          const techs = techTracks[cat.key];
          const count = techs.length;
          const sorted = sortTechs(techs);
          const vp = TRACK_VP[count] ?? 0;
          const discount = TRACK_DISCOUNT[count] ?? 0;
          const nextVpIndex = TRACK_VP.findIndex((v, i) => i > count && v > vp);
          const nextVp = nextVpIndex >= 0 ? TRACK_VP[nextVpIndex] : null;
          const techsToNextVp = nextVpIndex >= 0 ? nextVpIndex - count : null;

          return (
            <div key={cat.key} style={{ marginBottom: 'var(--spacing-lg)' }}>
              {/* Track header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
                paddingBottom: '6px',
                borderBottom: `2px solid ${cat.color}`,
              }}>
                <span style={{
                  color: cat.color,
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                }}>
                  {cat.fullLabel} Tech
                </span>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {count} / {TRACK_SIZE}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Discount:{' '}
                    <span style={{
                      color: count > 0 ? 'var(--accent-green)' : 'var(--text-muted)',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}>
                      {count < TRACK_SIZE ? `\u2212${discount}` : 'MAX'}
                    </span>
                  </span>
                  {techsToNextVp !== null && nextVp !== null && (
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Next{' '}
                      <span style={{ color: 'var(--accent-yellow)', fontWeight: 'bold' }}>
                        {nextVp}{'\u2605'}
                      </span>
                      {' '}in {techsToNextVp} tech{techsToNextVp !== 1 ? 's' : ''}
                    </span>
                  )}
                  {count >= TRACK_SIZE && (
                    <span style={{ color: 'var(--accent-yellow)', fontWeight: 'bold' }}>Track complete!</span>
                  )}
                </div>
              </div>

              {/* Track row: category bar + 7 slots + VP total */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'stretch' }}>
                {/* Category color bar */}
                <div style={{
                  width: '6px',
                  minWidth: '6px',
                  borderRadius: '3px',
                  background: cat.color,
                }} />

                {/* 7 slots */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: '6px',
                  flex: 1,
                }}>
                  {Array.from({ length: TRACK_SIZE }, (_, i) => {
                    const techId = sorted[i];
                    const isFilled = i < count && techId;
                    const slotVp = TRACK_VP[i + 1] ?? 0;
                    const showVp = i >= 3;

                    return (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                        {isFilled ? (
                          <TechTileCard techId={techId} />
                        ) : (
                          <div style={{
                            aspectRatio: '1',
                            borderRadius: '8px',
                            background: 'rgba(0,0,0,0.4)',
                            border: `2px solid ${cat.color}`,
                            opacity: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <span style={{
                              fontSize: '20px',
                              fontWeight: 'bold',
                              fontFamily: 'var(--font-mono)',
                              color: '#fff',
                            }}>
                              {TRACK_DISCOUNT[i] ? <>&minus;{TRACK_DISCOUNT[i]}</> : ''}
                            </span>
                          </div>
                        )}
                        {/* VP shield below slot */}
                        {showVp && <VpShield value={slotVp} earned={i < count} />}
                      </div>
                    );
                  })}
                </div>

                {/* VP total on the right */}
                <div style={{
                  width: '48px',
                  minWidth: '48px',
                  borderRadius: '6px',
                  border: `2px solid ${cat.color}`,
                  background: 'rgba(0,0,0,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                }}>
                  <span style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    fontFamily: 'var(--font-mono)',
                    color: vp > 0 ? 'var(--accent-yellow)' : 'var(--text-muted)',
                    lineHeight: 1,
                  }}>
                    {vp}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    color: vp > 0 ? 'var(--accent-yellow)' : 'var(--text-muted)',
                  }}>
                    {'\u2605'} VP
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PlayerResearch() {
  const { filteredState } = useGameState();
  const [collapsed, setCollapsed] = useState(false);
  const [showBoard, setShowBoard] = useState(false);

  if (!filteredState) return null;

  const player = filteredState.you;
  const totalVP = CATEGORIES.reduce(
    (sum, cat) => sum + (TRACK_VP[player.techTracks[cat.key].length] ?? 0),
    0,
  );
  const totalTechs = CATEGORIES.reduce(
    (sum, cat) => sum + player.techTracks[cat.key].length,
    0,
  );

  return (
    <div>
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          marginBottom: collapsed ? 0 : 'var(--spacing-sm)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          userSelect: 'none',
        }}
      >
        <span>My Research</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {!collapsed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBoard(true);
              }}
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: '3px',
                color: 'var(--text-muted)',
                fontSize: '9px',
                padding: '2px 6px',
                cursor: 'pointer',
                textTransform: 'none',
                letterSpacing: '0',
              }}
            >
              View Board
            </button>
          )}
          {!collapsed && totalTechs > 0 && (
            <span style={{ fontSize: '10px', color: 'var(--accent-yellow)', letterSpacing: 0 }}>
              {totalTechs} tech{totalTechs !== 1 ? 's' : ''} · {totalVP}{'\u2605'}
            </span>
          )}
          <span style={{ fontSize: '10px' }}>{collapsed ? '+' : '-'}</span>
        </div>
      </div>

      {!collapsed && (
        <div className="research-tracks">
          {CATEGORIES.map(cat => (
            <TrackCategory
              key={cat.key}
              label={cat.label}
              color={cat.color}
              techs={player.techTracks[cat.key]}
            />
          ))}
        </div>
      )}

      {showBoard && (
        <ResearchBoardOverlay
          techTracks={player.techTracks}
          onClose={() => setShowBoard(false)}
        />
      )}
    </div>
  );
}
