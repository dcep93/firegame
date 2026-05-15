import { Button } from '../shared/Button';

interface BattleControlsProps {
  stepIndex: number;
  totalSteps: number;
  autoAdvance: boolean;
  isComplete: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSkipBattle: () => void;
  onSkipAll: () => void;
  onToggleAuto: () => void;
  onDismiss: () => void;
}

export function BattleControls({
  stepIndex,
  totalSteps,
  autoAdvance,
  isComplete,
  onPrev,
  onNext,
  onSkipBattle,
  onSkipAll,
  onToggleAuto,
  onDismiss,
}: BattleControlsProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'var(--spacing-sm) 0',
      borderTop: '1px solid var(--border-color)',
      gap: 'var(--spacing-sm)',
    }}>
      <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
        <Button
          size="sm"
          variant="secondary"
          onClick={onPrev}
          disabled={stepIndex === 0}
        >
          Prev
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={onNext}
          disabled={isComplete}
        >
          Next
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={onSkipBattle}
        >
          Skip Battle
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onToggleAuto}
          style={{
            color: autoAdvance ? 'var(--accent-green)' : 'var(--text-muted)',
          }}
        >
          Auto: {autoAdvance ? 'ON' : 'OFF'}
        </Button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {totalSteps > 0 ? `${stepIndex + 1}/${totalSteps}` : '0/0'}
        </span>
        {isComplete && (
          <Button size="sm" variant="primary" onClick={onDismiss}>
            Done
          </Button>
        )}
        {!isComplete && (
          <Button size="sm" variant="ghost" onClick={onSkipAll}>
            Skip All
          </Button>
        )}
      </div>
    </div>
  );
}
