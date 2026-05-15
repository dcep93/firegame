import type { TrackSlot } from '../../utils/compute-economy';

export function TrackRow({ label, slots, color, shape }: {
  label: string;
  slots: TrackSlot[];
  color: string;
  shape: 'circle' | 'square';
}) {
  const borderRadius = shape === 'circle' ? '50%' : '3px';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <span style={{
        width: '64px',
        fontSize: '10px',
        color: 'var(--text-secondary)',
        textAlign: 'right',
        flexShrink: 0,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
      }}>
        {label}
      </span>
      <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
        {slots.map((slot, i) => (
          <div
            key={i}
            title={slot.filled
              ? `On track (value: ${slot.value})`
              : `Placed (value: ${slot.value})`
            }
            style={{
              width: '20px',
              height: '20px',
              borderRadius,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
              ...(slot.isCurrent
                ? {
                    background: 'rgba(255, 255, 255, 0.85)',
                    color: '#111',
                    border: '1.5px solid #fff',
                    opacity: 1,
                  }
                : slot.filled
                  ? {
                      background: color,
                      opacity: 0.8,
                      color: 'rgba(0, 0, 0, 0.5)',
                      border: '1.5px solid transparent',
                      ...(slot.isNext ? {
                        boxShadow: `0 0 6px ${color}, 0 0 2px ${color}`,
                        opacity: 1,
                        border: '1.5px solid rgba(255, 255, 255, 0.6)',
                      } : {}),
                    }
                  : {
                      background: 'transparent',
                      color,
                      border: `1.5px solid ${color}`,
                      opacity: 0.45,
                    }
              ),
            }}
          >
            {slot.value > 0 ? slot.value : ''}
          </div>
        ))}
      </div>
    </div>
  );
}
