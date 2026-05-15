import { Button } from '../shared/Button';

interface SlotInfo {
  readonly slotType: string;
  readonly tile: { readonly value: number; readonly fromAmbassador: boolean } | null;
}

interface ReputationSelectionPanelProps {
  drawn: readonly number[];
  currentTrack: readonly SlotInfo[];
  eligibleSlotIndices: readonly number[];
  selectedDrawnIndex: number | null;
  selectedSlotIndex: number | null;
  bestDrawnIndex: number;
  onSelectDrawn: (index: number | null) => void;
  onSelectSlot: (index: number) => void;
  onConfirm: () => void;
  onDecline: () => void;
  canConfirm: boolean;
}

const SLOT_TYPE_LABELS: Record<string, string> = {
  ambassador: 'A',
  reputation: 'R',
  shared: '',
};

const SLOT_TYPE_TITLES: Record<string, string> = {
  ambassador: 'Ambassador only',
  reputation: 'Reputation only',
  shared: 'Shared slot',
};

export function ReputationSelectionPanel({
  drawn,
  currentTrack,
  eligibleSlotIndices,
  selectedDrawnIndex,
  selectedSlotIndex,
  bestDrawnIndex,
  onSelectDrawn,
  onSelectSlot,
  onConfirm,
  onDecline,
  canConfirm,
}: ReputationSelectionPanelProps) {
  const eligibleSet = new Set(eligibleSlotIndices);

  return (
    <div style={{ padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', height: '100%' }}>
      <h3 style={{ color: 'var(--accent-gold, #f59e0b)', margin: 0, fontSize: '16px' }}>
        Reputation Tiles
      </h3>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
        Choose a tile to keep and a slot to place it in
      </p>

      {/* Drawn tiles */}
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
          Drawn Tiles
        </span>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {drawn.map((value, index) => {
            const isSelected = selectedDrawnIndex === index;
            const isBest = index === bestDrawnIndex;
            return (
              <button
                key={index}
                onClick={() => onSelectDrawn(isSelected ? null : index)}
                title={`Value: ${value}${isBest ? ' (highest)' : ''}`}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '6px',
                  background: isSelected
                    ? 'var(--accent-gold, #f59e0b)'
                    : isBest
                      ? 'rgba(245, 158, 11, 0.3)'
                      : 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: isSelected ? '#000' : isBest ? 'var(--accent-gold, #f59e0b)' : 'var(--text-secondary)',
                  border: isSelected
                    ? '2px solid var(--accent-gold, #f59e0b)'
                    : isBest
                      ? '2px solid var(--accent-gold, #f59e0b)'
                      : '2px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  padding: 0,
                }}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current track */}
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
          Your Track
        </span>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {currentTrack.map((slot, index) => {
            const isEligible = eligibleSet.has(index);
            const isSelected = selectedSlotIndex === index;
            const hasTile = slot.tile !== null;
            const isAmbassador = slot.tile?.fromAmbassador ?? false;
            const typeLabel = SLOT_TYPE_LABELS[slot.slotType] ?? '';
            const typeTitle = SLOT_TYPE_TITLES[slot.slotType] ?? slot.slotType;

            return (
              <button
                key={index}
                onClick={isEligible ? () => onSelectSlot(index) : undefined}
                title={`${typeTitle}${hasTile ? ` — ${isAmbassador ? 'Ambassador' : 'Rep'}: ${slot.tile!.value}` : ' — Empty'}`}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '6px',
                  background: isSelected
                    ? 'rgba(245, 158, 11, 0.2)'
                    : hasTile
                      ? isAmbassador
                        ? 'rgba(59, 130, 246, 0.15)'
                        : 'rgba(245, 158, 11, 0.1)'
                      : 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: hasTile ? '16px' : '13px',
                  fontWeight: hasTile ? 'bold' : 'normal',
                  color: !isEligible
                    ? 'var(--text-muted)'
                    : hasTile
                      ? isAmbassador ? '#3b82f6' : 'var(--accent-gold, #f59e0b)'
                      : 'var(--text-muted)',
                  border: isSelected
                    ? '2px solid var(--accent-gold, #f59e0b)'
                    : hasTile
                      ? `2px solid ${isAmbassador ? 'rgba(59, 130, 246, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
                      : '2px dashed var(--border-color)',
                  cursor: isEligible ? 'pointer' : 'default',
                  opacity: isEligible ? 1 : 0.5,
                  transition: 'all var(--transition-fast)',
                  padding: 0,
                  position: 'relative',
                }}
              >
                {hasTile ? slot.tile!.value : '\u00B7'}
                {typeLabel && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    background: slot.slotType === 'ambassador' ? '#3b82f6' : '#f59e0b',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '14px',
                    height: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {typeLabel}
                  </span>
                )}
                {isAmbassador && hasTile && (
                  <span style={{
                    position: 'absolute',
                    bottom: '-2px',
                    fontSize: '8px',
                    color: '#3b82f6',
                  }}>
                    amb
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {selectedSlotIndex !== null && currentTrack[selectedSlotIndex]?.tile !== null && (
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Replacing existing tile (value {currentTrack[selectedSlotIndex]!.tile!.value}) — it returns to the bag
          </span>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'auto' }}>
        <Button onClick={onConfirm} disabled={!canConfirm} style={{ flex: 1 }}>
          Keep &amp; Place
        </Button>
        <Button onClick={onDecline} style={{ flex: 1, background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
          Decline
        </Button>
      </div>
    </div>
  );
}
