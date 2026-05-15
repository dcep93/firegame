import { Button } from '../shared/Button';
import type { ResourceType } from '@eclipse/shared';

const TRACK_LABELS: Record<string, string> = {
  money: 'Money',
  science: 'Science',
  materials: 'Materials',
};

const TRACK_COLORS: Record<string, string> = {
  money: 'var(--accent-gold, #f59e0b)',
  science: 'var(--accent-pink, #ec4899)',
  materials: 'var(--accent-brown, #a16207)',
};

const DIE_COLORS: Record<string, string> = {
  yellow: '#eab308',
  orange: '#f97316',
  blue: '#3b82f6',
  red: '#ef4444',
};

interface DieRoll {
  dieColor: string;
  faceValue: number;
  isHit: boolean;
}

interface BombardmentChoicePanelProps {
  totalDamage: number;
  populations: readonly { slotIndex: number; sourceTrack: ResourceType; isWild: boolean }[];
  rolls: readonly DieRoll[];
  selectedIndices: Set<number>;
  requiredCount: number;
  canConfirm: boolean;
  onToggleCube: (index: number) => void;
  onConfirm: () => void;
  hasOrbitalPop: boolean;
  orbitalTrack: ResourceType | null;
  destroyOrbital: boolean;
  onToggleOrbital: () => void;
}

export function BombardmentChoicePanel({
  totalDamage,
  populations,
  rolls,
  selectedIndices,
  requiredCount,
  canConfirm,
  onToggleCube,
  onConfirm,
  hasOrbitalPop,
  orbitalTrack,
  destroyOrbital,
  onToggleOrbital,
}: BombardmentChoicePanelProps) {
  const allMiss = totalDamage === 0;
  const totalTargets = populations.length + (hasOrbitalPop ? 1 : 0);
  const allDestroyed = requiredCount >= totalTargets && totalTargets > 0;

  const selectionCount = selectedIndices.size + (destroyOrbital ? 1 : 0);

  // Summary text below dice
  let summaryText: string;
  if (allMiss) {
    summaryText = 'All misses — population survives';
  } else if (allDestroyed) {
    summaryText = `${totalDamage} damage — all ${totalTargets} cube${totalTargets !== 1 ? 's' : ''} destroyed`;
  } else {
    summaryText = `${totalDamage} damage — destroy ${requiredCount} of ${totalTargets} cube${totalTargets !== 1 ? 's' : ''}`;
  }

  // Button label
  let buttonLabel: string;
  if (allMiss) {
    buttonLabel = 'Continue';
  } else if (allDestroyed) {
    buttonLabel = `Destroy all ${totalTargets} cube${totalTargets !== 1 ? 's' : ''}`;
  } else {
    buttonLabel = `Destroy ${selectionCount} / ${requiredCount} cube${requiredCount !== 1 ? 's' : ''}`;
  }

  return (
    <div style={{ padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', height: '100%' }}>
      <h3 style={{ color: 'var(--accent-red, #ef4444)', margin: 0, fontSize: '16px' }}>
        Bombardment
      </h3>

      {/* Dice rolls display */}
      {rolls.length > 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          padding: 'var(--spacing-xs) var(--spacing-sm)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--border-radius)',
          border: '1px solid var(--border-color)',
        }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Weapon Rolls (vs 0 shield)
          </span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {rolls.map((roll, i) => (
              <div
                key={i}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: DIE_COLORS[roll.dieColor] ?? '#666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#fff',
                  border: roll.isHit ? '2px solid #fff' : '2px solid transparent',
                  opacity: roll.isHit ? 1 : 0.4,
                  position: 'relative',
                }}
                title={`${roll.dieColor} die: ${roll.faceValue}${roll.isHit ? ' (HIT)' : ' (miss)'}`}
              >
                {roll.faceValue === 0 ? '*' : roll.faceValue}
                {roll.isHit && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    fontSize: '10px',
                    background: '#22c55e',
                    borderRadius: '50%',
                    width: '14px',
                    height: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {'\u2713'}
                  </span>
                )}
              </div>
            ))}
          </div>
          <span style={{
            fontSize: '11px',
            color: allMiss ? 'var(--text-muted)' : 'var(--text-secondary)',
          }}>
            {summaryText}
          </span>
        </div>
      )}

      {/* Population cube selection — only for partial damage */}
      {!allMiss && (
        <>
          {!allDestroyed && (
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
              Choose which population cube{requiredCount !== 1 ? 's' : ''} to destroy:
            </p>
          )}

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            {populations.map((pop, index) => {
              const checked = selectedIndices.has(index);
              const trackLabel = TRACK_LABELS[pop.sourceTrack] ?? pop.sourceTrack;
              const color = pop.isWild ? 'var(--text-muted, #888)' : (TRACK_COLORS[pop.sourceTrack] ?? 'var(--text-primary)');
              const isInteractive = !allDestroyed;
              return (
                <label
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    background: checked ? 'rgba(239, 68, 68, 0.12)' : 'var(--bg-tertiary)',
                    border: `1px solid ${checked ? 'var(--accent-red, #ef4444)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--border-radius)',
                    cursor: isInteractive ? 'pointer' : 'default',
                    transition: 'background var(--transition-fast)',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                  }}
                  onClick={isInteractive ? () => onToggleCube(index) : undefined}
                >
                  {isInteractive && (
                    <span style={{
                      width: '16px',
                      height: '16px',
                      border: `2px solid ${checked ? 'var(--accent-red, #ef4444)' : 'var(--text-muted)'}`,
                      borderRadius: '3px',
                      background: checked ? 'var(--accent-red, #ef4444)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '10px',
                      color: '#fff',
                    }}>
                      {checked ? '\u2713' : ''}
                    </span>
                  )}
                  {pop.isWild ? (
                    <span style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '2px',
                      background: 'linear-gradient(135deg, var(--accent-brown, #a16207) 33%, var(--accent-pink, #ec4899) 33%, var(--accent-pink, #ec4899) 66%, var(--accent-gold, #f59e0b) 66%)',
                      flexShrink: 0,
                      border: '1px solid var(--text-muted)',
                    }} />
                  ) : (
                    <span style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '2px',
                      background: color,
                      flexShrink: 0,
                    }} />
                  )}
                  {pop.isWild ? (
                    <>Wild cube <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({trackLabel})</span></>
                  ) : (
                    <>{trackLabel} cube</>
                  )}
                  {allDestroyed && (
                    <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--accent-red, #ef4444)' }}>
                      destroyed
                    </span>
                  )}
                </label>
              );
            })}

            {/* Orbital population cube */}
            {hasOrbitalPop && orbitalTrack && (() => {
              const checked = destroyOrbital;
              const label = TRACK_LABELS[orbitalTrack] ?? orbitalTrack;
              const color = TRACK_COLORS[orbitalTrack] ?? 'var(--text-primary)';
              const isInteractive = !allDestroyed;
              return (
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    background: checked ? 'rgba(239, 68, 68, 0.12)' : 'var(--bg-tertiary)',
                    border: `1px solid ${checked ? 'var(--accent-red, #ef4444)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--border-radius)',
                    cursor: isInteractive ? 'pointer' : 'default',
                    transition: 'background var(--transition-fast)',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                  }}
                  onClick={isInteractive ? onToggleOrbital : undefined}
                >
                  {isInteractive && (
                    <span style={{
                      width: '16px',
                      height: '16px',
                      border: `2px solid ${checked ? 'var(--accent-red, #ef4444)' : 'var(--text-muted)'}`,
                      borderRadius: '3px',
                      background: checked ? 'var(--accent-red, #ef4444)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '10px',
                      color: '#fff',
                    }}>
                      {checked ? '\u2713' : ''}
                    </span>
                  )}
                  <span style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: color,
                    flexShrink: 0,
                    border: '1px solid var(--text-muted)',
                  }} />
                  {label} cube (Orbital)
                  {allDestroyed && (
                    <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--accent-red, #ef4444)' }}>
                      destroyed
                    </span>
                  )}
                </label>
              );
            })()}
          </div>
        </>
      )}

      <Button onClick={onConfirm} disabled={!canConfirm} style={{ width: '100%' }}>
        {buttonLabel}
      </Button>
    </div>
  );
}
