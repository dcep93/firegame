import { useEffect, useCallback } from 'react';
import {
  SHIP_PARTS_BY_ID,
  SHIP_LIMITS,
} from '@eclipse/shared';
import type {
  BlueprintState,
  ShipType,
} from '@eclipse/shared';
import { ShipIcon } from '../shared/ShipIcon';
import {
  PART_CATEGORY_COLORS,
  DIE_COLOR_LABELS,
  SHIP_LABELS,
  StatBadge,
  WeaponsLine,
} from './BlueprintCard';

const SHIP_ORDER: ShipType[] = [
  'interceptor' as ShipType,
  'cruiser' as ShipType,
  'dreadnought' as ShipType,
  'starbase' as ShipType,
];

const SHIP_TOTALS: Record<string, number> = {
  interceptor: SHIP_LIMITS.interceptor,
  cruiser: SHIP_LIMITS.cruiser,
  dreadnought: SHIP_LIMITS.dreadnought,
  starbase: SHIP_LIMITS.starbase,
};

// ── Large Part Slot Card ──

function LargePartSlot({
  partId,
  isFixed,
}: {
  partId: string | null;
  isFixed: boolean;
}) {
  const def = partId ? SHIP_PARTS_BY_ID[partId] : null;
  const color = def ? PART_CATEGORY_COLORS[def.category] ?? 'var(--text-secondary)' : 'var(--text-muted)';

  if (!def) {
    // Empty slot
    return (
      <div style={{
        width: '120px',
        minHeight: '80px',
        borderRadius: '6px',
        border: '2px dashed var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        opacity: 0.5,
      }}>
        <span style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          any
        </span>
      </div>
    );
  }

  // Compute stat deltas
  const deltas: { label: string; value: string; color: string }[] = [];
  if (def.energyDelta !== 0) {
    const c = def.energyDelta > 0 ? 'var(--accent-yellow)' : 'var(--accent-red)';
    deltas.push({ label: 'Eng', value: `${def.energyDelta > 0 ? '+' : ''}${def.energyDelta}`, color: c });
  }
  if (def.initiativeDelta !== 0) {
    deltas.push({ label: 'Init', value: `${def.initiativeDelta > 0 ? '+' : ''}${def.initiativeDelta}`, color: 'var(--accent-gold, #f59e0b)' });
  }
  if (def.computerDelta !== 0) {
    deltas.push({ label: 'Comp', value: `${def.computerDelta > 0 ? '+' : ''}${def.computerDelta}`, color: 'var(--accent-blue)' });
  }
  if (def.shieldDelta !== 0) {
    deltas.push({ label: 'Shld', value: `${def.shieldDelta > 0 ? '+' : ''}${def.shieldDelta}`, color: '#26c6da' });
  }
  if (def.hullDelta !== 0) {
    deltas.push({ label: 'Hull', value: `${def.hullDelta > 0 ? '+' : ''}${def.hullDelta}`, color: 'var(--text-secondary)' });
  }
  if (def.movementDelta !== 0) {
    deltas.push({ label: 'Mv', value: `${def.movementDelta > 0 ? '+' : ''}${def.movementDelta}`, color: 'var(--accent-green)' });
  }

  return (
    <div style={{
      width: '120px',
      minHeight: '80px',
      borderRadius: '6px',
      borderLeft: `4px solid ${color}`,
      border: `1px solid ${color}44`,
      borderLeftWidth: '4px',
      borderLeftColor: color,
      background: `${color}08`,
      padding: '8px 10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    }}>
      {/* Part name */}
      <div style={{
        fontSize: '12px',
        fontWeight: 700,
        color: 'var(--text-primary)',
        lineHeight: 1.2,
      }}>
        {def.name}
      </div>

      {/* Stat deltas */}
      {deltas.length > 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1px',
        }}>
          {deltas.map((d, i) => (
            <span key={i} style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: d.color,
              fontWeight: 600,
            }}>
              {d.label} {d.value}
            </span>
          ))}
        </div>
      )}

      {/* Weapon info */}
      {def.weapon && (() => {
        const dieInfo = DIE_COLOR_LABELS[def.weapon.dieColor];
        if (!dieInfo) return null;
        return (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            {def.weapon.isMissile ? (
              <span style={{ fontSize: '12px', lineHeight: 1 }}>{'\u{1F3AF}'}</span>
            ) : (
              <span style={{
                width: '14px',
                height: '14px',
                borderRadius: '3px',
                background: dieInfo.color,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '8px',
                color: '#000',
                fontWeight: 700,
                lineHeight: 1,
                flexShrink: 0,
              }}>{'\u2022'}</span>
            )}
            <span style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              color: dieInfo.color,
            }}>
              {def.weapon.dieCount}&times;{dieInfo.label} {def.weapon.isMissile ? 'missile' : 'cannon'}
            </span>
          </div>
        );
      })()}

      {/* Base / Upgraded label */}
      <div style={{
        fontSize: '9px',
        fontWeight: 700,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        color: isFixed ? 'var(--text-muted)' : 'var(--accent-green)',
        marginTop: 'auto',
      }}>
        {isFixed ? 'BASE' : 'UPGRADED'}
      </div>
    </div>
  );
}

// ── Ship Section ──

function ShipSection({
  shipType,
  blueprint,
  supply,
  total,
}: {
  shipType: ShipType;
  blueprint: BlueprintState;
  supply: number;
  total: number;
}) {
  const { computed } = blueprint;
  const built = total - supply;
  const fixedSet = new Set(blueprint.fixedParts);
  const slots = blueprint.grid.flat();

  return (
    <div style={{
      background: 'var(--bg-tertiary)',
      borderRadius: '8px',
      border: '1px solid var(--border-color)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 16px',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(0,0,0,0.15)',
      }}>
        <span style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          letterSpacing: '1px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          textTransform: 'uppercase',
        }}>
          <ShipIcon shipType={shipType} size={28} />
          {SHIP_LABELS[shipType] ?? shipType}
        </span>
        <span style={{
          fontSize: '12px',
          color: built > 0 ? 'var(--text-primary)' : 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
        }}>
          Built {built}/{total}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Part slots */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}>
          {slots.map((partId, i) => (
            <LargePartSlot
              key={i}
              partId={partId}
              isFixed={partId !== null && fixedSet.has(partId)}
            />
          ))}
        </div>

        {/* Stats footer */}
        <div style={{
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
          alignItems: 'stretch',
          paddingTop: '8px',
          borderTop: '1px solid var(--border-color)',
        }}>
          <StatBadge icon={'\u25B6'} label="Initiative" value={computed.initiative} color="var(--accent-gold, #f59e0b)" expanded />
          <StatBadge icon={'\u279A'} label="Movement" value={computed.movement} color="var(--accent-green, #22c55e)" expanded />
          <StatBadge icon={'\u2665'} label="Hull" value={computed.hullValue} color="var(--text-secondary, #9ca3af)" expanded />
          <StatBadge icon={'\u25C8'} label="Shield" value={computed.shieldValue} color="#26c6da" expanded />
          <StatBadge icon={'\u2316'} label="Computer" value={computed.computerValue} color="var(--accent-blue, #3b82f6)" expanded />

          {/* Energy badge */}
          {(() => {
            const { energyBalance, energyProduction, energyConsumption } = computed;
            const energyColor = energyBalance >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
            return (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '4px 8px',
                borderRadius: '4px',
                background: `${energyColor}15`,
                border: `1px solid ${energyColor}44`,
                minWidth: '48px',
              }}>
                <span style={{ fontSize: '14px', lineHeight: 1 }}>{'\u26A1'}</span>
                <span style={{
                  fontSize: '8px',
                  fontWeight: 500,
                  color: energyColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginTop: '1px',
                }}>Energy</span>
                <span style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: energyColor,
                  lineHeight: 1.1,
                }}>+{energyProduction}/{'\u2212'}{energyConsumption}</span>
              </div>
            );
          })()}

          <WeaponsLine weapons={computed.weapons} missiles={computed.missiles} expanded />
        </div>
      </div>
    </div>
  );
}

// ── Main Overlay ──

interface BlueprintBoardOverlayProps {
  blueprints: Readonly<Record<string, BlueprintState>>;
  shipSupply: Readonly<Record<string, number>>;
  onClose: () => void;
}

export function BlueprintBoardOverlay({ blueprints, shipSupply, onClose }: BlueprintBoardOverlayProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const totalBuilt = SHIP_ORDER.reduce((sum, st) => {
    const total = SHIP_TOTALS[st] ?? 0;
    const supply = shipSupply[st] ?? 0;
    return sum + (total - supply);
  }, 0);

  return (
    <div
      className="tech-supply-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="tech-supply-board" style={{ maxWidth: '1000px' }}>
        <div className="tech-supply-board__header">
          <span className="tech-supply-board__title">Ship Blueprints</span>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
              {totalBuilt} ship{totalBuilt !== 1 ? 's' : ''} built
            </span>
            <button className="tech-supply-board__close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {SHIP_ORDER.map(shipType => {
            const blueprint = blueprints[shipType];
            if (!blueprint) return null;
            const total = SHIP_TOTALS[shipType] ?? 0;
            const supply = shipSupply[shipType] ?? 0;
            return (
              <ShipSection
                key={shipType}
                shipType={shipType}
                blueprint={blueprint}
                supply={supply}
                total={total}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
