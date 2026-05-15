import { useState } from 'react';
import { Button } from '../shared/Button';
import type { InfluenceFlowResult, PendingTrackChoice } from '../../hooks/useInfluenceFlow';
import type { HexCoord, ResourceType, FilteredGameState } from '@eclipse/shared';
import { useGameState } from '../../hooks/useGameState';

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

interface InfluencePanelProps {
  step: 'pick_source' | 'pick_destination';
  queue: InfluenceFlowResult['queue'];
  maxActivations: number;
  discsOnTrack: number;
  colonyShipFlips: number;
  facedownColonyShips: number;
  placeableSectors: HexCoord[];
  removableSectors: HexCoord[];
  pendingTrackChoice: PendingTrackChoice | null;
  onSelectPlace: () => void;
  onSelectRemove: (pos: HexCoord) => void;
  onSetColonyShipFlips: (n: number) => void;
  onRemoveFromQueue: (index: number) => void;
  onUpdateTrackChoice: (slotIndex: number, track: ResourceType) => void;
  onConfirmTrackChoice: () => void;
  onCancelTrackChoice: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

function getSectorId(board: FilteredGameState['board'] | undefined, pos: HexCoord): string {
  if (!board) return `${pos.q},${pos.r}`;
  const key = `${pos.q},${pos.r}`;
  return board.sectors[key]?.sectorId ?? key;
}

function formatActivation(act: { from: string | HexCoord; to: string | HexCoord }, board: FilteredGameState['board'] | undefined): string {
  if (act.from === 'INFLUENCE_TRACK') {
    const to = act.to as HexCoord;
    return `Place at #${getSectorId(board, to)}`;
  }
  const from = act.from as HexCoord;
  return `Remove from #${getSectorId(board, from)}`;
}

export function InfluencePanel({
  step,
  queue,
  maxActivations,
  discsOnTrack,
  colonyShipFlips,
  facedownColonyShips,
  placeableSectors,
  removableSectors,
  pendingTrackChoice,
  onSelectPlace,
  onSelectRemove,
  onSetColonyShipFlips,
  onRemoveFromQueue,
  onUpdateTrackChoice,
  onConfirmTrackChoice,
  onCancelTrackChoice,
  onConfirm,
  onCancel,
}: InfluencePanelProps) {
  const { filteredState } = useGameState();
  const board = filteredState?.board;
  const isMulti = maxActivations > 1;
  const queueFull = queue.length >= maxActivations;

  // Track choice sub-panel for gray/orbital cube return track selection
  if (pendingTrackChoice) {
    const pos = pendingTrackChoice.sectorPos;
    return (
      <div style={{
        padding: 'var(--spacing-md)',
        background: 'var(--bg-secondary)',
        height: '100%',
        overflowY: 'auto',
        borderLeft: '1px solid var(--border-color)',
        fontSize: '12px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-md)',
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'var(--accent-blue)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Return Track
          </span>
          <Button size="sm" variant="ghost" onClick={onCancelTrackChoice}>Back</Button>
        </div>

        <div style={{
          padding: 'var(--spacing-sm)',
          background: 'var(--bg-primary)',
          borderRadius: 'var(--border-radius)',
          marginBottom: 'var(--spacing-md)',
          color: 'var(--accent-yellow)',
          fontSize: '13px',
        }}>
          Removing disc from sector #{getSectorId(board, pos)} — choose return tracks for special cubes
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          {pendingTrackChoice.entries.map(entry => (
            <div key={entry.slotIndex} style={{
              padding: 'var(--spacing-sm)',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--border-color)',
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                marginBottom: '4px',
              }}>
                {entry.label}
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {entry.allowedTracks.map(track => {
                  const selected = entry.selectedTrack === track;
                  return (
                    <button
                      key={track}
                      onClick={() => onUpdateTrackChoice(entry.slotIndex, track)}
                      style={{
                        flex: 1,
                        padding: '4px 6px',
                        fontSize: '11px',
                        fontWeight: selected ? 'bold' : 'normal',
                        color: selected ? '#fff' : 'var(--text-primary)',
                        background: selected ? (TRACK_COLORS[track] ?? 'var(--accent-blue)') : 'var(--bg-primary)',
                        border: `1px solid ${selected ? 'transparent' : 'var(--border-color)'}`,
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {TRACK_LABELS[track] ?? track}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <Button variant="primary" size="sm" onClick={onConfirmTrackChoice} style={{ width: '100%' }}>
            Confirm
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'pick_destination') {
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
            color: 'var(--accent-blue)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Influence
          </span>
          <Button size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
        </div>

        {/* Instruction */}
        <div style={{
          padding: 'var(--spacing-sm)',
          background: 'var(--bg-primary)',
          borderRadius: 'var(--border-radius)',
          marginBottom: 'var(--spacing-md)',
          color: 'var(--accent-yellow)',
          fontSize: '13px',
        }}>
          Select a sector to place your influence disc
        </div>

        <div style={{
          padding: 'var(--spacing-sm)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--border-radius)',
          border: '1px solid var(--accent-blue)',
          color: 'var(--text-primary)',
          fontSize: '13px',
          fontWeight: 'bold',
        }}>
          Placing disc from track
        </div>
      </div>
    );
  }

  // PICK_SOURCE step
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
          color: 'var(--accent-blue)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          Influence
        </span>
        <Button size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>

      {/* Discs on track */}
      <div style={{
        padding: 'var(--spacing-xs) var(--spacing-sm)',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--border-radius)',
        marginBottom: 'var(--spacing-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ color: 'var(--text-secondary)' }}>Discs on track</span>
        <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold', fontSize: '14px' }}>
          {discsOnTrack}
        </span>
      </div>

      {/* Activation counter (multi only) */}
      {isMulti && queue.length > 0 && (
        <div style={{
          padding: 'var(--spacing-xs) var(--spacing-sm)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--border-radius)',
          marginBottom: 'var(--spacing-md)',
          color: 'var(--text-secondary)',
        }}>
          Activation {queue.length} / {maxActivations}
        </div>
      )}

      {/* Instruction */}
      <div style={{
        padding: 'var(--spacing-sm)',
        background: 'var(--bg-primary)',
        borderRadius: 'var(--border-radius)',
        marginBottom: 'var(--spacing-md)',
        color: 'var(--accent-yellow)',
        fontSize: '13px',
      }}>
        {queueFull
          ? 'Queue full \u2014 confirm or remove an item'
          : 'Choose to place or remove an influence disc'}
      </div>

      {/* Place Disc button */}
      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <div style={{
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: 'var(--text-secondary)',
          fontWeight: 'bold',
          marginBottom: 'var(--spacing-xs)',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '4px',
        }}>
          Place Disc
        </div>
        <PlaceDiscButton
          disabled={discsOnTrack <= 0 || queueFull || placeableSectors.length === 0}
          targetCount={placeableSectors.length}
          onSelect={onSelectPlace}
        />
      </div>

      {/* Remove Disc section */}
      {removableSectors.length > 0 && (
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <div style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--text-secondary)',
            fontWeight: 'bold',
            marginBottom: 'var(--spacing-xs)',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '4px',
          }}>
            Remove Disc
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {removableSectors.map(pos => (
              <RemoveSectorRow
                key={`${pos.q},${pos.r}`}
                position={pos}
                sectorId={getSectorId(board, pos)}
                disabled={queueFull}
                onSelect={() => onSelectRemove(pos)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Colony Ship Flips */}
      {facedownColonyShips > 0 && (
        <div style={{
          padding: 'var(--spacing-xs) var(--spacing-sm)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--border-radius)',
          marginBottom: 'var(--spacing-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ color: 'var(--text-secondary)' }}>Colony ship flips</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => onSetColonyShipFlips(colonyShipFlips - 1)}
              disabled={colonyShipFlips <= 0}
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                cursor: colonyShipFlips > 0 ? 'pointer' : 'not-allowed',
                opacity: colonyShipFlips > 0 ? 1 : 0.4,
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              -
            </button>
            <span style={{ color: 'var(--accent-green)', fontWeight: 'bold', fontSize: '14px', minWidth: '16px', textAlign: 'center' }}>
              {colonyShipFlips}
            </span>
            <button
              onClick={() => onSetColonyShipFlips(colonyShipFlips + 1)}
              disabled={colonyShipFlips >= Math.min(2, facedownColonyShips)}
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                cursor: colonyShipFlips < Math.min(2, facedownColonyShips) ? 'pointer' : 'not-allowed',
                opacity: colonyShipFlips < Math.min(2, facedownColonyShips) ? 1 : 0.4,
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              +
            </button>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              / {facedownColonyShips}
            </span>
          </div>
        </div>
      )}

      {/* Queue */}
      {isMulti && queue.length > 0 && (
        <div style={{
          padding: 'var(--spacing-sm)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--border-radius)',
          marginBottom: 'var(--spacing-md)',
          border: '1px solid var(--border-color)',
        }}>
          <div style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--spacing-xs)',
          }}>
            Queued ({queue.length})
          </div>
          {queue.map((act, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '4px 0',
              borderBottom: i < queue.length - 1 ? '1px solid var(--border-color)' : undefined,
            }}>
              <span style={{ color: 'var(--text-primary)' }}>
                {i + 1}. {formatActivation(act, board)}
              </span>
              <button
                onClick={() => onRemoveFromQueue(i)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-red)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '0 4px',
                }}
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirm / Cancel */}
      {isMulti && (
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-sm)',
          marginTop: 'var(--spacing-sm)',
        }}>
          <Button
            variant="primary"
            size="sm"
            disabled={queue.length === 0 && colonyShipFlips === 0}
            onClick={onConfirm}
            style={{ flex: 1 }}
          >
            Confirm{queue.length > 0 ? ` (${queue.length})` : ''}
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
      )}
    </div>
  );
}

function PlaceDiscButton({ disabled, targetCount, onSelect }: { disabled: boolean; targetCount: number; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      disabled={disabled}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 8px',
        background: hovered && !disabled ? 'var(--bg-hover)' : 'var(--bg-tertiary)',
        border: `1px solid ${hovered && !disabled ? 'var(--accent-blue)' : 'var(--border-color)'}`,
        borderRadius: '4px',
        cursor: !disabled ? 'pointer' : 'not-allowed',
        opacity: !disabled ? 1 : 0.45,
        width: '100%',
        textAlign: 'left',
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        color: 'var(--text-primary)',
      }}
    >
      <span style={{ fontWeight: 'bold' }}>Place Disc</span>
      <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        {targetCount} target{targetCount !== 1 ? 's' : ''}
      </span>
    </button>
  );
}

function RemoveSectorRow({ position, sectorId, disabled, onSelect }: { position: HexCoord; sectorId: string; disabled: boolean; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      disabled={disabled}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 8px',
        background: hovered && !disabled ? 'var(--bg-hover)' : 'var(--bg-tertiary)',
        border: `1px solid ${hovered && !disabled ? 'var(--accent-blue)' : 'var(--border-color)'}`,
        borderRadius: '4px',
        cursor: !disabled ? 'pointer' : 'not-allowed',
        opacity: !disabled ? 1 : 0.45,
        width: '100%',
        textAlign: 'left',
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        color: 'var(--text-primary)',
      }}
    >
      <span style={{ fontWeight: 'bold' }}>Sector #{sectorId}</span>
      <span style={{ fontSize: '9px', color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>
        remove
      </span>
    </button>
  );
}
