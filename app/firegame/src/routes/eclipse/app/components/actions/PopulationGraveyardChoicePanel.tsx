import { Button } from '../shared/Button';

const TRACK_OPTIONS: Record<string, { label: string; color: string }> = {
  materials: { label: 'Materials', color: 'var(--accent-orange, #f97316)' },
  science: { label: 'Science', color: 'var(--accent-pink, #ec4899)' },
  money: { label: 'Money', color: 'var(--accent-gold, #f59e0b)' },
};

const SOURCE_LABELS: Record<string, string> = {
  orbital: 'Orbital cube',
  wild: 'Wild cube',
};

interface GraveyardChoice {
  source: 'orbital' | 'wild';
  validTracks: readonly string[];
}

interface PopulationGraveyardChoicePanelProps {
  choices: GraveyardChoice[];
  assignments: (string | null)[];
  onSetAssignment: (index: number, track: string) => void;
  canConfirm: boolean;
  onConfirm: () => void;
}

export function PopulationGraveyardChoicePanel({
  choices,
  assignments,
  onSetAssignment,
  canConfirm,
  onConfirm,
}: PopulationGraveyardChoicePanelProps) {
  return (
    <div style={{ padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', height: '100%' }}>
      <h3 style={{ color: 'var(--accent-red, #ef4444)', margin: 0, fontSize: '16px' }}>
        Population Destroyed
      </h3>

      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
        {choices.length === 1
          ? 'Choose which graveyard to send the destroyed cube to:'
          : `Choose graveyards for ${choices.length} destroyed cubes:`}
      </p>

      {choices.map((choice, idx) => {
        const selected = assignments[idx];
        return (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {SOURCE_LABELS[choice.source] ?? choice.source}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {choice.validTracks.map(track => {
                const opt = TRACK_OPTIONS[track];
                if (!opt) return null;
                const isSelected = selected === track;
                return (
                  <label
                    key={track}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-tertiary)',
                      border: `1px solid ${isSelected ? 'var(--accent-blue, #6366f1)' : 'var(--border-color)'}`,
                      borderRadius: 'var(--border-radius)',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)',
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                    }}
                    onClick={() => onSetAssignment(idx, track)}
                  >
                    <span style={{
                      width: '14px',
                      height: '14px',
                      border: `2px solid ${isSelected ? 'var(--accent-blue, #6366f1)' : 'var(--text-muted)'}`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {isSelected && (
                        <span style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: 'var(--accent-blue, #6366f1)',
                        }} />
                      )}
                    </span>
                    <span style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: opt.color,
                      flexShrink: 0,
                      border: '1px solid var(--text-muted)',
                    }} />
                    {opt.label}
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}

      <Button onClick={onConfirm} disabled={!canConfirm} style={{ width: '100%', marginTop: 'auto' }}>
        Confirm
      </Button>
    </div>
  );
}
