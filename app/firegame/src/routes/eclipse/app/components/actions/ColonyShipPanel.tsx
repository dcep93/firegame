import { PopulationSquareType } from '@eclipse/shared';
import { Button } from '../shared/Button';
import type { QueuedPlacement, AvailableSlot, SectorGroup } from '../../hooks/useColonyShipFlow';

type TrackName = 'materials' | 'science' | 'money';

const TRACK_LABELS: Record<TrackName, string> = {
  materials: 'Materials',
  science: 'Science',
  money: 'Money',
};

const TRACK_SHORT: Record<TrackName, string> = {
  materials: 'M',
  science: 'S',
  money: '$',
};

const TRACK_COLORS: Record<TrackName, string> = {
  materials: 'var(--resource-materials)',
  science: 'var(--resource-science)',
  money: 'var(--resource-money)',
};

const SLOT_LABELS: Record<string, string> = {
  [PopulationSquareType.Money]: 'Money',
  [PopulationSquareType.Science]: 'Science',
  [PopulationSquareType.Materials]: 'Materials',
  [PopulationSquareType.Wild]: 'Wild',
  orbital: 'Orbital',
};

const SLOT_COLORS: Record<string, string> = {
  [PopulationSquareType.Money]: 'var(--resource-money)',
  [PopulationSquareType.Science]: 'var(--resource-science)',
  [PopulationSquareType.Materials]: 'var(--resource-materials)',
  [PopulationSquareType.Wild]: 'var(--resource-wild, var(--accent-yellow))',
  orbital: 'var(--accent-cyan, #0ff)',
};

interface WildSlotPending {
  targetSector: { q: number; r: number };
  targetSlotIndex: number;
  sectorName: string;
  validTracks: TrackName[];
}

interface ColonyShipPanelProps {
  queue: QueuedPlacement[];
  wildSlotPending: WildSlotPending | null;
  remainingShips: number;
  availableCubes: Record<TrackName, number>;
  sectorGroups: SectorGroup[];
  onSelectSlot: (slot: AvailableSlot) => void;
  onConfirmWildTrack: (track: TrackName) => void;
  onCancelWildPick: () => void;
  onRemoveFromQueue: (index: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ColonyShipPanel({
  queue,
  wildSlotPending,
  remainingShips,
  availableCubes,
  sectorGroups,
  onSelectSlot,
  onConfirmWildTrack,
  onCancelWildPick,
  onRemoveFromQueue,
  onConfirm,
  onCancel,
}: ColonyShipPanelProps) {
  return (
    <div style={{
      padding: 'var(--spacing-md)',
      background: 'var(--bg-secondary)',
      height: '100%',
      overflowY: 'auto',
      borderLeft: '1px solid var(--border-color)',
      fontSize: '12px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--spacing-md)',
      }}>
        <span style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: 'var(--accent-green)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          Colony Ship
        </span>
        <Button size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>

      {/* Resource summary */}
      <div style={{
        padding: 'var(--spacing-xs) var(--spacing-sm)',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--border-radius)',
        marginBottom: 'var(--spacing-md)',
        color: 'var(--text-secondary)',
        lineHeight: 1.8,
      }}>
        <div>Ships: <strong style={{ color: remainingShips > 0 ? 'var(--text-primary)' : 'var(--accent-red)' }}>{remainingShips}</strong> remaining</div>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <span>Cubes:</span>
          {(['materials', 'science', 'money'] as const).map(track => (
            <span key={track} style={{ color: TRACK_COLORS[track] }}>
              {TRACK_SHORT[track]}:{availableCubes[track]}
            </span>
          ))}
        </div>
      </div>

      {/* Wild track picker */}
      {wildSlotPending && (
        <div style={{
          padding: 'var(--spacing-sm)',
          background: 'rgba(255, 193, 7, 0.1)',
          borderRadius: 'var(--border-radius)',
          marginBottom: 'var(--spacing-md)',
          border: '1px solid var(--accent-yellow)',
        }}>
          <div style={{
            fontSize: '11px',
            color: 'var(--accent-yellow)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: 'var(--spacing-xs)',
          }}>
            Choose track for wild slot
          </div>
          <div style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            marginBottom: 'var(--spacing-xs)',
          }}>
            {wildSlotPending.sectorName} — {wildSlotPending.targetSlotIndex === -1 ? 'Orbital' : `slot ${wildSlotPending.targetSlotIndex}`}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {wildSlotPending.validTracks.map(track => (
              <button
                key={track}
                onClick={() => onConfirmWildTrack(track)}
                disabled={availableCubes[track] <= 0}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  borderRadius: 'var(--border-radius)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-tertiary)',
                  color: availableCubes[track] > 0 ? TRACK_COLORS[track] : 'var(--text-muted)',
                  cursor: availableCubes[track] > 0 ? 'pointer' : 'not-allowed',
                  opacity: availableCubes[track] > 0 ? 1 : 0.4,
                  fontSize: '12px',
                  fontWeight: 'bold',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {TRACK_LABELS[track]}
              </button>
            ))}
          </div>
          <button
            onClick={onCancelWildPick}
            style={{
              marginTop: '4px',
              padding: '2px 6px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Available placements */}
      <div style={{
        fontSize: '11px',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: 'var(--spacing-xs)',
      }}>
        Available Placements
      </div>

      {sectorGroups.length === 0 && remainingShips <= 0 && (
        <div style={{
          padding: 'var(--spacing-sm)',
          color: 'var(--text-muted)',
          fontSize: '11px',
        }}>
          No ships remaining
        </div>
      )}

      {sectorGroups.length === 0 && remainingShips > 0 && (
        <div style={{
          padding: 'var(--spacing-sm)',
          color: 'var(--text-muted)',
          fontSize: '11px',
        }}>
          No available slots
        </div>
      )}

      {sectorGroups.map(group => (
        <div key={group.sectorKey} style={{
          marginBottom: 'var(--spacing-sm)',
        }}>
          <div style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '2px',
            marginBottom: '4px',
          }}>
            {group.sectorName}
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {group.slots.map(slot => (
              <button
                key={`${slot.targetSlotIndex}`}
                onClick={() => onSelectSlot(slot)}
                disabled={!!wildSlotPending}
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--border-radius)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-tertiary)',
                  color: SLOT_COLORS[slot.slotType] ?? 'var(--text-primary)',
                  cursor: wildSlotPending ? 'not-allowed' : 'pointer',
                  opacity: wildSlotPending ? 0.5 : 1,
                  fontSize: '11px',
                  fontFamily: 'var(--font-body)',
                  position: 'relative' as const,
                }}
              >
                {SLOT_LABELS[slot.slotType] ?? slot.slotType}
                {slot.advanced && (
                  <span style={{
                    marginLeft: '2px',
                    color: 'var(--accent-yellow)',
                    fontSize: '10px',
                  }}>
                    *
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Queued placements */}
      {queue.length > 0 && (
        <>
          <div style={{
            fontSize: '11px',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginTop: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-xs)',
          }}>
            Queued ({queue.length})
          </div>
          {queue.map((placement, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                padding: '4px var(--spacing-xs)',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--border-radius)',
                marginBottom: '3px',
                fontSize: '11px',
              }}
            >
              <span style={{ color: 'var(--text-muted)', width: '16px' }}>{i + 1}.</span>
              <span style={{ color: 'var(--text-primary)', flex: 1 }}>
                {placement.sectorName}:{' '}
                <span style={{ color: SLOT_COLORS[placement.slotType] ?? 'var(--text-primary)' }}>
                  {SLOT_LABELS[placement.slotType] ?? placement.slotType}
                </span>
                {' '}&larr;{' '}
                <span style={{ color: TRACK_COLORS[placement.sourceTrack] }}>
                  {TRACK_LABELS[placement.sourceTrack]}
                </span>
              </span>
              <button
                onClick={() => onRemoveFromQueue(i)}
                style={{
                  padding: '1px 5px',
                  background: 'transparent',
                  border: '1px solid var(--border-color)',
                  borderRadius: '3px',
                  color: 'var(--accent-red)',
                  cursor: 'pointer',
                  fontSize: '10px',
                  lineHeight: 1,
                }}
              >
                x
              </button>
            </div>
          ))}
        </>
      )}

      {/* Confirm / Cancel buttons */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-sm)',
        marginTop: 'var(--spacing-md)',
      }}>
        <Button
          variant="primary"
          size="sm"
          disabled={queue.length === 0}
          onClick={onConfirm}
          style={{ flex: 1 }}
        >
          Confirm ({queue.length})
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={onCancel}
          style={{ flex: 1 }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
