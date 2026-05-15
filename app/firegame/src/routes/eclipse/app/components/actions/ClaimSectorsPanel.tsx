import { Button } from '../shared/Button';

interface ClaimSectorsPanelProps {
  eligibleSectors: Array<{ key: string; label: string; position: { q: number; r: number } }>;
  selectedKeys: Set<string>;
  onToggleSector: (key: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onConfirm: () => void;
  onDecline: () => void;
}

export function ClaimSectorsPanel({
  eligibleSectors,
  selectedKeys,
  onToggleSector,
  onSelectAll,
  onDeselectAll,
  onConfirm,
  onDecline,
}: ClaimSectorsPanelProps) {
  const allSelected = eligibleSectors.every(s => selectedKeys.has(s.key));
  const noneSelected = selectedKeys.size === 0;

  return (
    <div style={{ padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', height: '100%' }}>
      <h3 style={{ color: 'var(--accent-blue)', margin: 0, fontSize: '16px' }}>
        Claim Sectors
      </h3>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
        Select conquered sectors to place influence discs
      </p>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
        {eligibleSectors.map(sector => {
          const checked = selectedKeys.has(sector.key);
          return (
            <label
              key={sector.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                background: checked ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-tertiary)',
                border: `1px solid ${checked ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer',
                transition: 'background var(--transition-fast)',
                fontSize: '13px',
                color: 'var(--text-primary)',
              }}
              onClick={() => onToggleSector(sector.key)}
            >
              <span style={{
                width: '16px',
                height: '16px',
                border: `2px solid ${checked ? 'var(--accent-blue)' : 'var(--text-muted)'}`,
                borderRadius: '3px',
                background: checked ? 'var(--accent-blue)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '10px',
                color: '#fff',
              }}>
                {checked ? '\u2713' : ''}
              </span>
              {sector.label}
            </label>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
        <Button
          variant="secondary"
          onClick={allSelected ? onDeselectAll : onSelectAll}
          style={{ flex: 1, fontSize: '12px' }}
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
        <Button onClick={onConfirm} disabled={noneSelected} style={{ width: '100%' }}>
          Confirm ({selectedKeys.size})
        </Button>
        <Button variant="danger" onClick={onDecline} style={{ width: '100%', fontSize: '12px' }}>
          Decline All
        </Button>
      </div>
    </div>
  );
}
