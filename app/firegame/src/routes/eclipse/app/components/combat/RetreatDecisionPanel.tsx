import type { RetreatDecisionFlowResult } from '../../hooks/useRetreatDecisionFlow';
import { Button } from '../shared/Button';

function formatShipType(shipType: string): string {
  return shipType.charAt(0).toUpperCase() + shipType.slice(1).toLowerCase();
}

export function RetreatDecisionPanel({
  retreat,
}: {
  retreat: RetreatDecisionFlowResult;
}) {
  const {
    validTargets,
    playerShips,
    selectedShipIds,
    selectedTarget,
    toggleShip,
    selectAllShips,
    deselectAllShips,
    selectTarget,
    confirmRetreat,
    continueFighting,
    canConfirmRetreat,
  } = retreat;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-sm)',
    }}>
      <div style={{
        fontSize: '14px',
        fontWeight: 'bold',
        color: 'var(--accent-yellow)',
        textAlign: 'center',
      }}>
        Retreat or continue fighting?
      </div>

      <div style={{
        fontSize: '12px',
        color: 'var(--text-muted)',
        textAlign: 'center',
      }}>
        Retreating ships won't fire next round but can still be targeted. Survivors escape after.
      </div>

      {/* Ship selection */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Ships to retreat:
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={selectAllShips}
              style={{
                fontSize: '11px',
                padding: '2px 6px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: '3px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              All
            </button>
            <button
              onClick={deselectAllShips}
              style={{
                fontSize: '11px',
                padding: '2px 6px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: '3px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              None
            </button>
          </div>
        </div>

        {playerShips.map(ship => {
          const isSelected = selectedShipIds.has(ship.shipId);
          const hpRemaining = Math.max(0, ship.hullValue + 1 - ship.damage);
          const hpTotal = ship.hullValue + 1;

          return (
            <label
              key={ship.shipId}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 8px',
                background: isSelected ? 'rgba(255, 193, 7, 0.1)' : 'var(--bg-tertiary)',
                border: `1px solid ${isSelected ? 'var(--accent-yellow)' : 'var(--border-color)'}`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleShip(ship.shipId)}
                style={{ accentColor: 'var(--accent-yellow)' }}
              />
              <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                {formatShipType(ship.shipType)}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                {hpRemaining}/{hpTotal} HP
              </span>
              {/* Hull bar */}
              <div style={{
                flex: 1,
                height: '6px',
                background: 'var(--bg-primary)',
                borderRadius: '3px',
                overflow: 'hidden',
                maxWidth: '80px',
              }}>
                <div style={{
                  width: `${(hpRemaining / hpTotal) * 100}%`,
                  height: '100%',
                  background: hpRemaining <= 1 ? 'var(--accent-red)' : 'var(--accent-green)',
                  borderRadius: '3px',
                  transition: 'width 0.3s',
                }} />
              </div>
            </label>
          );
        })}
      </div>

      {/* Destination selection */}
      {selectedShipIds.size > 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Retreat destination:
          </span>
          {validTargets.map(hex => {
            const key = `${hex.q},${hex.r}`;
            const isSelected = selectedTarget?.q === hex.q && selectedTarget?.r === hex.r;

            return (
              <label
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 8px',
                  background: isSelected ? 'rgba(76, 175, 80, 0.1)' : 'var(--bg-tertiary)',
                  border: `1px solid ${isSelected ? 'var(--accent-green)' : 'var(--border-color)'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                <input
                  type="radio"
                  name="retreat-target"
                  checked={isSelected}
                  onChange={() => selectTarget(hex)}
                  style={{ accentColor: 'var(--accent-green)' }}
                />
                <span style={{ color: 'var(--text-primary)' }}>
                  Sector ({hex.q}, {hex.r})
                </span>
              </label>
            );
          })}
        </div>
      )}

      {/* Action buttons */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-sm)',
        justifyContent: 'center',
        marginTop: 'var(--spacing-xs)',
        borderTop: '1px solid var(--border-color)',
        paddingTop: 'var(--spacing-sm)',
      }}>
        <Button
          variant="primary"
          size="lg"
          onClick={continueFighting}
          style={{ minWidth: '160px', fontSize: '16px' }}
        >
          Continue Fighting
        </Button>
        <Button
          variant="danger"
          size="lg"
          onClick={confirmRetreat}
          disabled={!canConfirmRetreat}
          style={{ minWidth: '140px', fontSize: '16px' }}
          title={selectedShipIds.size === 0 ? 'Select ships to retreat' : !selectedTarget ? 'Select a destination' : undefined}
        >
          Retreat{selectedShipIds.size > 0 ? ` (${selectedShipIds.size})` : ''}
        </Button>
      </div>
    </div>
  );
}
