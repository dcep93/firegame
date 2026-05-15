import { useState } from 'react';
import {
  ShipPartCategory,
  SHIP_PARTS_BY_ID,
  DieColor,
} from '@eclipse/shared';
import type {
  BlueprintState,
  ComputedBlueprintStats,
  WeaponSummary,
  ShipType,
} from '@eclipse/shared';
import { ShipIcon } from '../shared/ShipIcon';

// ── Constants ──

const PART_ABBREV: Record<string, string> = {
  nuclear_source: 'Nuc', fusion_source: 'Fus', tachyon_source: 'Tac', zero_point_source: 'ZPt',
  nuclear_drive: 'NuD', fusion_drive: 'FuD', tachyon_drive: 'TaD', transition_drive: 'TrD',
  ion_cannon: 'Ion', plasma_cannon: 'Pla', antimatter_cannon: 'Ant', soliton_cannon: 'Sol',
  plasma_missile: 'PlM', flux_missile: 'FlM',
  electron_computer: 'Elc', positron_computer: 'Pos', gluon_computer: 'Glu',
  gauss_shield: 'Gau', phase_shield: 'Pha', absorption_shield: 'Abs', conifold_field: 'Con',
  hull: 'Hul', improved_hull: 'Imp', sentient_hull: 'Sen',
  muon_source: 'Muo',
};

export const PART_CATEGORY_COLORS: Record<string, string> = {
  [ShipPartCategory.Weapon]: 'var(--accent-red)',
  [ShipPartCategory.Energy]: 'var(--accent-yellow)',
  [ShipPartCategory.Drive]: 'var(--accent-green)',
  [ShipPartCategory.Computer]: 'var(--accent-blue)',
  [ShipPartCategory.Shield]: '#26c6da',
  [ShipPartCategory.Hull]: 'var(--text-secondary)',
};

export const DIE_COLOR_LABELS: Record<string, { label: string; fullLabel: string; color: string }> = {
  [DieColor.Yellow]: { label: 'Y', fullLabel: 'Yellow', color: 'var(--accent-yellow)' },
  [DieColor.Orange]: { label: 'O', fullLabel: 'Orange', color: 'var(--accent-orange)' },
  [DieColor.Red]: { label: 'R', fullLabel: 'Red', color: 'var(--accent-red)' },
  [DieColor.Blue]: { label: 'B', fullLabel: 'Blue', color: 'var(--accent-blue)' },
};

export const SHIP_LABELS: Record<string, string> = {
  interceptor: 'INTERCEPTOR',
  cruiser: 'CRUISER',
  dreadnought: 'DREADNOUGHT',
  starbase: 'STARBASE',
};

// ── Part Slot ──

function PartSlot({ partId, isFixed }: { partId: string | null; isFixed: boolean }) {
  const [hovered, setHovered] = useState(false);
  const def = partId ? SHIP_PARTS_BY_ID[partId] : null;
  const abbrev = partId ? (PART_ABBREV[partId] ?? partId.slice(0, 3)) : null;
  const color = def ? PART_CATEGORY_COLORS[def.category] ?? 'var(--text-secondary)' : undefined;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        width: '36px',
        height: '24px',
        borderRadius: '3px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '9px',
        fontWeight: 600,
        fontFamily: 'var(--font-mono)',
        color: def ? 'var(--bg-primary)' : 'var(--text-muted)',
        background: def ? color : 'var(--bg-primary)',
        border: def
          ? `1px solid ${color}`
          : '1px dashed var(--border-color)',
        opacity: isFixed ? 0.7 : 1,
        cursor: 'default',
      }}
    >
      {abbrev ?? '\u00B7'}
      {hovered && def && (
        <Tooltip def={def} />
      )}
    </div>
  );
}

function Tooltip({ def }: { def: { name: string; category: string; energyDelta: number; initiativeDelta: number; computerDelta: number; shieldDelta: number; hullDelta: number; movementDelta: number } }) {
  const deltas: string[] = [];
  if (def.energyDelta !== 0) deltas.push(`Energy ${def.energyDelta > 0 ? '+' : ''}${def.energyDelta}`);
  if (def.initiativeDelta !== 0) deltas.push(`Init ${def.initiativeDelta > 0 ? '+' : ''}${def.initiativeDelta}`);
  if (def.computerDelta !== 0) deltas.push(`Comp ${def.computerDelta > 0 ? '+' : ''}${def.computerDelta}`);
  if (def.shieldDelta !== 0) deltas.push(`Shield ${def.shieldDelta > 0 ? '+' : ''}${def.shieldDelta}`);
  if (def.hullDelta !== 0) deltas.push(`Hull ${def.hullDelta > 0 ? '+' : ''}${def.hullDelta}`);
  if (def.movementDelta !== 0) deltas.push(`Move ${def.movementDelta > 0 ? '+' : ''}${def.movementDelta}`);

  return (
    <div style={{
      position: 'absolute',
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginBottom: '4px',
      padding: '4px 8px',
      background: 'var(--bg-primary)',
      border: '1px solid var(--border-color)',
      borderRadius: '4px',
      whiteSpace: 'nowrap',
      fontSize: '10px',
      color: 'var(--text-primary)',
      zIndex: 100,
      pointerEvents: 'none',
    }}>
      <div style={{ fontWeight: 600 }}>{def.name}</div>
      {deltas.length > 0 && (
        <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
          {deltas.join(' · ')}
        </div>
      )}
    </div>
  );
}

// ── Stat Badge ──

export function StatBadge({ label, value, color, icon, expanded }: { label: string; value: number; color: string; icon: string; expanded?: boolean }) {
  if (expanded) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '4px 8px',
          borderRadius: '4px',
          background: value > 0 ? `${color}15` : 'var(--bg-primary)',
          border: `1px solid ${value > 0 ? `${color}44` : 'var(--border-color)'}`,
          minWidth: '48px',
        }}
      >
        <span style={{ fontSize: '14px', lineHeight: 1 }}>{icon}</span>
        <span style={{
          fontSize: '8px',
          fontWeight: 500,
          color: value > 0 ? color : 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginTop: '1px',
        }}>{label}</span>
        <span style={{
          fontSize: '15px',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          color: value > 0 ? color : 'var(--text-muted)',
          lineHeight: 1.1,
        }}>{value}</span>
      </div>
    );
  }

  return (
    <span
      title={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '2px',
        padding: '1px 5px',
        borderRadius: '3px',
        background: value > 0 ? `${color}22` : 'var(--bg-primary)',
        border: `1px solid ${value > 0 ? `${color}66` : 'var(--border-color)'}`,
        fontSize: '10px',
        fontWeight: 600,
        fontFamily: 'var(--font-mono)',
        color: value > 0 ? color : 'var(--text-muted)',
        lineHeight: 1.2,
      }}
    >
      <span style={{ fontSize: '9px' }}>{icon}</span>
      {value}
    </span>
  );
}

// ── Weapons Display ──

export function WeaponsLine({ weapons, missiles, expanded }: { weapons: readonly WeaponSummary[]; missiles: readonly WeaponSummary[]; expanded?: boolean }) {
  const allWeapons = [
    ...weapons.map(w => ({ ...w, isMissile: false })),
    ...missiles.map(w => ({ ...w, isMissile: true })),
  ];

  if (allWeapons.length === 0) {
    return <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>No weapons</span>;
  }

  if (expanded) {
    return (
      <span style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
        {allWeapons.map((w, i) => {
          const dieInfo = DIE_COLOR_LABELS[w.dieColor];
          if (!dieInfo) return null;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '4px 8px',
                borderRadius: '4px',
                background: `${dieInfo.color}15`,
                border: `1px solid ${dieInfo.color}44`,
                minWidth: '48px',
              }}
            >
              {w.isMissile ? (
                <span style={{ fontSize: '14px', lineHeight: 1 }}>{'\u{1F3AF}'}</span>
              ) : (
                <span style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '3px',
                  background: dieInfo.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: '#000',
                  fontWeight: 700,
                  lineHeight: 1,
                  boxShadow: `0 1px 3px ${dieInfo.color}66`,
                }}>{'\u2022'}</span>
              )}
              <span style={{
                fontSize: '8px',
                fontWeight: 500,
                color: dieInfo.color,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginTop: '1px',
              }}>{w.isMissile ? 'Missile' : 'Cannon'}</span>
              <span style={{
                fontSize: '15px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: dieInfo.color,
                lineHeight: 1.1,
              }}>{w.dieCount}</span>
            </div>
          );
        })}
      </span>
    );
  }

  return (
    <span style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
      {allWeapons.map((w, i) => {
        const dieInfo = DIE_COLOR_LABELS[w.dieColor];
        if (!dieInfo) return null;
        return (
          <span
            key={i}
            title={`${w.dieCount}x ${dieInfo.fullLabel} die${w.isMissile ? ' (missile)' : ''}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              padding: '1px 5px',
              borderRadius: '3px',
              background: `${dieInfo.color}22`,
              border: `1px solid ${dieInfo.color}55`,
              fontSize: '10px',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: dieInfo.color,
              lineHeight: 1.2,
            }}
          >
            {w.dieCount}&times;{dieInfo.label}{w.isMissile ? 'm' : ''}
          </span>
        );
      })}
    </span>
  );
}

// ── Main Component ──

interface BlueprintCardProps {
  shipType: ShipType;
  blueprint: BlueprintState;
  supply: number;
  total: number;
  expanded?: boolean;
}

export function BlueprintCard({ shipType, blueprint, supply, total, expanded }: BlueprintCardProps) {
  const { computed } = blueprint;
  const built = total - supply;
  const fixedSet = new Set(blueprint.fixedParts);

  // Flatten grid to 1D for display (row 0 is the slot row)
  const slots = blueprint.grid.flat();

  return (
    <div style={{
      flex: '1 1 0',
      minWidth: '180px',
      padding: '8px',
      background: 'var(--bg-tertiary)',
      borderRadius: '4px',
      border: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    }}>
      {/* Header: ship name + supply */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          letterSpacing: '0.5px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <ShipIcon shipType={shipType} size={20} />
          {SHIP_LABELS[shipType] ?? shipType}
        </span>
        <span style={{
          fontSize: '10px',
          color: built > 0 ? 'var(--text-primary)' : 'var(--text-muted)',
        }}>
          {built}/{total}
        </span>
      </div>

      {/* Part grid */}
      <div style={{
        display: 'flex',
        gap: '3px',
        flexWrap: 'wrap',
      }}>
        {slots.map((partId, i) => (
          <PartSlot
            key={i}
            partId={partId}
            isFixed={partId !== null && fixedSet.has(partId)}
          />
        ))}
      </div>

      {/* Stats + Weapons */}
      <StatsRow computed={computed} expanded={expanded} />
    </div>
  );
}

function StatsRow({ computed, expanded }: { computed: ComputedBlueprintStats; expanded?: boolean }) {
  const { energyBalance, energyProduction, energyConsumption } = computed;
  const energyColor = energyBalance >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    }}>
      {/* Combat stats as colored badges */}
      <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
        <StatBadge icon={'\u25B6'} label="Initiative" value={computed.initiative} color="var(--accent-gold, #f59e0b)" expanded={expanded} />
        <StatBadge icon={'\u279A'} label="Movement" value={computed.movement} color="var(--accent-green, #22c55e)" expanded={expanded} />
        <StatBadge icon={'\u2665'} label="Hull" value={computed.hullValue} color="var(--text-secondary, #9ca3af)" expanded={expanded} />
        <StatBadge icon={'\u25C8'} label="Shield" value={computed.shieldValue} color="#26c6da" expanded={expanded} />
        <StatBadge icon={'\u2316'} label="Computer" value={computed.computerValue} color="var(--accent-blue, #3b82f6)" expanded={expanded} />
      </div>
      {/* Energy + Weapons row */}
      <div style={{ display: 'flex', gap: expanded ? '4px' : '6px', flexWrap: 'wrap', alignItems: expanded ? 'stretch' : 'center' }}>
        {expanded ? (
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
        ) : (
          <span
            title={`Energy: +${energyProduction} / -${energyConsumption}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              padding: '1px 5px',
              borderRadius: '3px',
              background: `${energyColor}22`,
              border: `1px solid ${energyColor}55`,
              fontSize: '10px',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              color: energyColor,
              lineHeight: 1.2,
            }}
          >
            {'\u26A1'}{energyBalance >= 0 ? '+' : ''}{energyBalance}
          </span>
        )}
        <WeaponsLine weapons={computed.weapons} missiles={computed.missiles} expanded={expanded} />
      </div>
    </div>
  );
}
