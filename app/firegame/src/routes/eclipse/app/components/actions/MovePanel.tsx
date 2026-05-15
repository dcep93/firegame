import { useState } from 'react';
import { SPECIES } from '@eclipse/shared';
import type { SpeciesId, HexCoord } from '@eclipse/shared';
import { Button } from '../shared/Button';
import { Modal } from '../shared/Modal';
import { useGameState } from '../../hooks/useGameState';
import type { MoveFlowResult, MovableShip } from '../../hooks/useMoveFlow';

const SHIP_TYPE_LABELS: Record<string, string> = {
  interceptor: 'Interceptor',
  cruiser: 'Cruiser',
  dreadnought: 'Dreadnought',
  starbase: 'Starbase',
};

interface MovePanelProps {
  step: 'pick_ship' | 'pick_destination';
  maxActivations: number;
  activationsUsed: number;
  isContinuation: boolean;
  selectedShipId: string | null;
  movableShips: MoveFlowResult['movableShips'];
  pendingAggressionMove: { allyId: string } | null;
  onSelectShip: (shipId: string) => void;
  onFinishMove: () => void;
  onCancel: () => void;
  onConfirmAggression: () => void;
  onCancelAggression: () => void;
}

function getSectorId(filteredState: ReturnType<typeof useGameState>['filteredState'], pos: HexCoord): string {
  const key = `${pos.q},${pos.r}`;
  return filteredState?.board.sectors[key]?.sectorId ?? key;
}

export function MovePanel({
  step,
  maxActivations,
  activationsUsed,
  isContinuation,
  selectedShipId,
  movableShips,
  pendingAggressionMove,
  onSelectShip,
  onFinishMove,
  onCancel,
  onConfirmAggression,
  onCancelAggression,
}: MovePanelProps) {
  const { filteredState } = useGameState();
  const isMulti = maxActivations > 1;
  const noMovableShips = movableShips.length === 0 ||
    movableShips.every(g => g.ships.length === 0);

  // Look up ally species name for the aggression warning
  const allySpeciesName = (() => {
    if (!pendingAggressionMove || !filteredState) return 'Unknown';
    const opponent = filteredState.opponents[pendingAggressionMove.allyId];
    if (!opponent) return 'Unknown';
    return SPECIES[opponent.speciesId as SpeciesId]?.name ?? opponent.speciesId;
  })();

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
          color: '#a855f7',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          Move
        </span>
        {!isContinuation && (
          <Button size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
        )}
      </div>

      {/* Activation counter (multi only) */}
      {isMulti && (
        <div style={{
          padding: 'var(--spacing-xs) var(--spacing-sm)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--border-radius)',
          marginBottom: 'var(--spacing-md)',
          color: 'var(--text-secondary)',
        }}>
          Activation {activationsUsed + 1} / {maxActivations}
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
        {step === 'pick_destination'
          ? 'Select destination on the board'
          : isContinuation
            ? noMovableShips
              ? 'No ships can move \u2014 click Done Moving'
              : 'Select another ship (or finish)'
            : 'Select a ship to move'}
      </div>

      {/* Ship list grouped by sector */}
      {step === 'pick_ship' && movableShips.map(group => (
        <div key={group.sectorKey} style={{ marginBottom: 'var(--spacing-md)' }}>
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
            Sector {getSectorId(filteredState, group.position)}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {group.ships.map(ship => (
              <ShipRow
                key={ship.shipId}
                ship={ship}
                sectorId={getSectorId(filteredState, ship.position)}
                disabled={false}
                onSelect={() => onSelectShip(ship.shipId)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* When picking destination, show selected ship info */}
      {step === 'pick_destination' && selectedShipId && (
        <div style={{
          padding: 'var(--spacing-sm)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--border-radius)',
          marginBottom: 'var(--spacing-md)',
          border: '1px solid #a855f7',
          color: 'var(--text-primary)',
          fontSize: '13px',
          fontWeight: 'bold',
        }}>
          Moving: {selectedShipId.split('-').slice(0, 2).join(' ')}
        </div>
      )}

      {/* Done Moving button (continuation mode) */}
      {isContinuation && (
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-sm)',
          marginTop: 'var(--spacing-sm)',
        }}>
          <Button
            variant="primary"
            size="sm"
            onClick={onFinishMove}
            style={{ flex: 1 }}
          >
            Done Moving
          </Button>
        </div>
      )}

      {/* Aggression warning modal */}
      <Modal isOpen={!!pendingAggressionMove} title="Break Alliance?" onClose={onCancelAggression}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
          Moving into <strong>{allySpeciesName}</strong>'s sector will
          {' '}<strong>break your diplomatic alliance</strong> and give you the
          {' '}<strong>Traitor Card</strong> (-2 VP).
        </p>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <Button variant="danger" onClick={onConfirmAggression}>Break Alliance</Button>
          <Button variant="ghost" onClick={onCancelAggression}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
}

function ShipRow({ ship, sectorId, disabled, onSelect }: { ship: MovableShip; sectorId: string; disabled: boolean; onSelect: () => void }) {
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
        border: `1px solid ${hovered && !disabled ? '#a855f7' : 'var(--border-color)'}`,
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
      <span style={{ fontWeight: 'bold' }}>
        {SHIP_TYPE_LABELS[ship.shipType] ?? ship.shipType}
      </span>
      <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        #{sectorId}
      </span>
    </button>
  );
}
