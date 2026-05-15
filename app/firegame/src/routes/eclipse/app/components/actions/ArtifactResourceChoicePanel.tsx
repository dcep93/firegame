import { Button } from '../shared/Button';

interface ArtifactResourceChoicePanelProps {
  totalResources: number;
  increment: number;
  money: number;
  materials: number;
  science: number;
  remaining: number;
  canConfirm: boolean;
  onSetResource: (type: 'money' | 'materials' | 'science', value: number) => void;
  onConfirm: () => void;
}

const ROWS: Array<{ type: 'money' | 'materials' | 'science'; label: string; color: string }> = [
  { type: 'money', label: 'Money', color: 'var(--accent-yellow)' },
  { type: 'materials', label: 'Materials', color: 'var(--accent-orange)' },
  { type: 'science', label: 'Science', color: 'var(--accent-pink)' },
];

export function ArtifactResourceChoicePanel({
  totalResources,
  increment,
  money,
  materials,
  science,
  remaining,
  canConfirm,
  onSetResource,
  onConfirm,
}: ArtifactResourceChoicePanelProps) {
  const values: Record<string, number> = { money, materials, science };

  return (
    <div style={{ padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', height: '100%' }}>
      <h3 style={{ color: 'var(--accent-blue)', margin: 0, fontSize: '16px' }}>
        Distribute Resources
      </h3>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
        Allocate {totalResources} resources in increments of {increment}
      </p>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', justifyContent: 'center' }}>
        {ROWS.map(row => {
          const val = values[row.type]!;
          return (
            <div
              key={row.type}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius)',
              }}
            >
              <span style={{ flex: 1, fontSize: '13px', color: row.color, fontWeight: 600 }}>
                {row.label}
              </span>
              <button
                onClick={() => onSetResource(row.type, val - increment)}
                disabled={val <= 0}
                style={{
                  width: '28px',
                  height: '28px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius)',
                  background: val <= 0 ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                  color: val <= 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                  cursor: val <= 0 ? 'default' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                -
              </button>
              <span style={{
                width: '36px',
                textAlign: 'center',
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}>
                {val}
              </span>
              <button
                onClick={() => onSetResource(row.type, val + increment)}
                disabled={remaining <= 0}
                style={{
                  width: '28px',
                  height: '28px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius)',
                  background: remaining <= 0 ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                  color: remaining <= 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                  cursor: remaining <= 0 ? 'default' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                +
              </button>
            </div>
          );
        })}
      </div>

      <div style={{
        textAlign: 'center',
        fontSize: '12px',
        color: remaining > 0 ? 'var(--accent-yellow)' : 'var(--text-muted)',
        fontWeight: 600,
      }}>
        {remaining > 0 ? `${remaining} remaining` : 'All allocated'}
      </div>

      <Button onClick={onConfirm} disabled={!canConfirm} style={{ width: '100%' }}>
        Confirm
      </Button>
    </div>
  );
}
