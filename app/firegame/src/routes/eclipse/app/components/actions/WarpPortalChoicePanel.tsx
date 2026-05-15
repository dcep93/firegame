import { Button } from '../shared/Button';

interface WarpPortalChoicePanelProps {
  eligibleSectors: Array<{ key: string; label: string; position: { q: number; r: number } }>;
  selectedKey: string | null;
  onSelectSector: (key: string) => void;
  onConfirm: () => void;
}

export function WarpPortalChoicePanel({
  eligibleSectors,
  selectedKey,
  onSelectSector,
  onConfirm,
}: WarpPortalChoicePanelProps) {
  return (
    <div style={{ padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', height: '100%' }}>
      <h3 style={{ color: 'var(--accent-blue)', margin: 0, fontSize: '16px' }}>
        Place Warp Portal
      </h3>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
        Select a sector to place your Warp Portal
      </p>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
        {eligibleSectors.map(sector => {
          const selected = sector.key === selectedKey;
          return (
            <div
              key={sector.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                background: selected ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-tertiary)',
                border: `1px solid ${selected ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer',
                transition: 'background var(--transition-fast)',
                fontSize: '13px',
                color: 'var(--text-primary)',
              }}
              onClick={() => onSelectSector(sector.key)}
            >
              <span style={{
                width: '16px',
                height: '16px',
                border: `2px solid ${selected ? 'var(--accent-blue)' : 'var(--text-muted)'}`,
                borderRadius: '50%',
                background: selected ? 'var(--accent-blue)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '10px',
                color: '#fff',
              }}>
                {selected ? '\u2713' : ''}
              </span>
              {sector.label}
            </div>
          );
        })}
      </div>

      <Button onClick={onConfirm} disabled={!selectedKey} style={{ width: '100%' }}>
        Confirm
      </Button>
    </div>
  );
}
