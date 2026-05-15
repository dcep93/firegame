import type { DamageAssignmentFlowResult } from '../../hooks/useDamageAssignmentFlow';
import { Button } from '../shared/Button';

const DIE_COLORS: Record<string, string> = {
  yellow: 'var(--accent-yellow)',
  orange: 'var(--accent-orange, #ff9800)',
  blue: 'var(--accent-blue)',
  red: 'var(--accent-red)',
};

function formatShipType(shipType: string): string {
  return shipType.charAt(0).toUpperCase() + shipType.slice(1).toLowerCase();
}

export function DamageAssignmentPanel({
  flow,
}: {
  flow: DamageAssignmentFlowResult;
}) {
  const {
    hits,
    targetShips,
    isMissile,
    assignments,
    unassignedHits,
    selectedHitIndex,
    selectHit,
    assignHitToShip,
    unassignHit,
    autoAssign,
    confirmAssignment,
    canConfirm,
  } = flow;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-sm)',
    }}>
      <div style={{
        fontSize: '14px',
        fontWeight: 'bold',
        color: 'var(--accent-red)',
        textAlign: 'center',
      }}>
        Assign incoming {isMissile ? 'missile' : 'engagement'} damage
      </div>

      <div style={{
        fontSize: '12px',
        color: 'var(--text-muted)',
        textAlign: 'center',
      }}>
        Click a die, then click a ship to assign. Click assigned dice to unassign.
      </div>

      {/* Unassigned hits */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '4px',
        }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Incoming hits ({unassignedHits.length} unassigned):
          </span>
          <button
            onClick={autoAssign}
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
            Auto
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {hits.map((hit, idx) => {
            const isUnassigned = unassignedHits.includes(idx);
            if (!isUnassigned) return null;
            const isSelected = selectedHitIndex === idx;

            return (
              <button
                key={idx}
                onClick={() => selectHit(idx)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: isSelected ? '2px solid white' : '2px solid transparent',
                  background: DIE_COLORS[hit.dieColor] ?? 'var(--text-muted)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isSelected ? '0 0 8px rgba(255,255,255,0.5)' : 'none',
                  opacity: 1,
                }}
                title={`${hit.dieColor} die: ${hit.damage} damage${hit.isBurst ? ' (burst)' : ''}`}
              >
                {hit.damage}
              </button>
            );
          })}
          {unassignedHits.length === 0 && (
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              All assigned
            </span>
          )}
        </div>
      </div>

      {/* Target ships */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Your ships:
        </span>
        {targetShips.map(ship => {
          const shipAssignments = assignments.get(ship.shipId) ?? [];
          const pendingDamage = shipAssignments.reduce((sum, idx) => sum + hits[idx]!.damage, 0);
          const hpTotal = ship.hullValue + 1;
          const hpRemaining = Math.max(0, hpTotal - ship.damage);
          const hpAfter = Math.max(0, hpRemaining - pendingDamage);
          const wouldDestroy = pendingDamage > ship.hullValue - ship.damage;

          return (
            <div
              key={ship.shipId}
              onClick={() => {
                if (selectedHitIndex !== null) {
                  assignHitToShip(selectedHitIndex, ship.shipId);
                }
              }}
              style={{
                padding: '6px 8px',
                background: selectedHitIndex !== null
                  ? 'rgba(255, 74, 106, 0.08)'
                  : 'var(--bg-tertiary)',
                border: `1px solid ${
                  wouldDestroy ? 'var(--accent-red)' :
                  shipAssignments.length > 0 ? 'var(--accent-yellow)' :
                  'var(--border-color)'
                }`,
                borderRadius: '4px',
                cursor: selectedHitIndex !== null ? 'pointer' : 'default',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: shipAssignments.length > 0 ? '4px' : 0,
              }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '13px' }}>
                  {formatShipType(ship.shipType)}
                </span>
                <span style={{ color: wouldDestroy ? 'var(--accent-red)' : 'var(--text-secondary)', fontSize: '12px' }}>
                  {hpAfter}/{hpTotal} HP
                  {pendingDamage > 0 && ` (-${pendingDamage})`}
                  {wouldDestroy && ' DESTROYED'}
                </span>
                {/* Hull bar */}
                <div style={{
                  flex: 1,
                  height: '6px',
                  background: 'var(--bg-primary)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  maxWidth: '80px',
                  position: 'relative',
                }}>
                  <div style={{
                    width: `${(hpRemaining / hpTotal) * 100}%`,
                    height: '100%',
                    background: hpAfter <= 0 ? 'var(--accent-red)' : 'var(--accent-green)',
                    borderRadius: '3px',
                  }} />
                  {pendingDamage > 0 && (
                    <div style={{
                      position: 'absolute',
                      right: `${(1 - hpRemaining / hpTotal) * 100}%`,
                      top: 0,
                      width: `${(pendingDamage / hpTotal) * 100}%`,
                      height: '100%',
                      background: 'rgba(255, 74, 106, 0.5)',
                      borderRadius: '3px',
                    }} />
                  )}
                </div>
              </div>

              {/* Assigned dice on this ship */}
              {shipAssignments.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                  {shipAssignments.map(hitIdx => {
                    const hit = hits[hitIdx]!;
                    return (
                      <button
                        key={hitIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          unassignHit(hitIdx);
                        }}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          border: '1px solid rgba(255,255,255,0.3)',
                          background: DIE_COLORS[hit.dieColor] ?? 'var(--text-muted)',
                          color: 'white',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title={`Click to unassign (${hit.damage} dmg)`}
                      >
                        {hit.damage}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirm button */}
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
          onClick={confirmAssignment}
          disabled={!canConfirm}
          style={{ minWidth: '200px', fontSize: '16px' }}
          title={!canConfirm ? 'Assign all hits before confirming' : undefined}
        >
          Confirm Damage ({hits.length} hit{hits.length !== 1 ? 's' : ''})
        </Button>
      </div>
    </div>
  );
}
