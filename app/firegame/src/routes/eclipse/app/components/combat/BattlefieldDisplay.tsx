import { useState, useEffect, useRef } from 'react';
import type {
  BattlefieldState,
  BattlefieldFaction,
  BattlefieldShipGroup,
  BattlefieldShip,
  BattlefieldShipStats,
} from '../../hooks/useBattlefield';
import type { WeaponSummary } from '@eclipse/shared';
import { DieColor, NpcType } from '@eclipse/shared';
import { ShipIcon } from '../shared/ShipIcon';

const NPC_IDS = new Set<string>([NpcType.Ancient, NpcType.Guardian, NpcType.GCDS]);

// ── Die color palette ──

const DICE_COLORS: Record<string, string> = {
  [DieColor.Yellow]: 'var(--accent-yellow)',
  [DieColor.Orange]: 'var(--accent-orange)',
  [DieColor.Blue]: 'var(--accent-blue)',
  [DieColor.Red]: 'var(--accent-red)',
};

// ── Weapon Dice Display ──

function WeaponDice({ weapons, label }: { weapons: readonly WeaponSummary[]; label?: string }) {
  if (weapons.length === 0) return null;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
      {label && (
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginRight: '1px' }}>
          {label}
        </span>
      )}
      {weapons.map((w, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '1px' }}>
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: DICE_COLORS[w.dieColor] ?? 'var(--text-muted)',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          {w.dieCount > 1 && (
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
              {'\u00d7'}{w.dieCount}
            </span>
          )}
        </span>
      ))}
    </span>
  );
}

// ── Compact Stats Line ──

function StatsLine({ stats }: { stats: BattlefieldShipStats }) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      alignItems: 'center',
      fontSize: '11px',
      color: 'var(--text-secondary)',
    }}>
      <span title="Computer">C:{stats.computerValue >= 0 ? '+' : ''}{stats.computerValue}</span>
      <span title="Shield">S:{stats.shieldValue}</span>
      {stats.missiles.length > 0 && <WeaponDice weapons={stats.missiles} label="M:" />}
      <WeaponDice weapons={stats.weapons} />
    </div>
  );
}

// ── Hull Segment Colors ──

function getSegmentColor(currentHp: number, totalHp: number): string {
  const fraction = totalHp > 0 ? currentHp / totalHp : 0;
  if (fraction > 0.6) return 'var(--accent-green)';
  if (fraction > 0.3) return 'var(--accent-yellow)';
  return 'var(--accent-red)';
}

// ── Chunked Hull Segments ──

function HullSegments({ ship, maxHull }: { ship: BattlefieldShip; maxHull: number }) {
  const totalHp = maxHull + 1;
  const currentHp = Math.max(0, totalHp - ship.damage);
  const segmentColor = getSegmentColor(currentHp, totalHp);

  // Track which segments just broke for animation
  const prevHpRef = useRef(currentHp);
  const [brokenSegments, setBrokenSegments] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (currentHp < prevHpRef.current) {
      // Segments that just broke: from currentHp to prevHp-1
      const newBroken = new Set<number>();
      for (let i = currentHp; i < prevHpRef.current; i++) {
        newBroken.add(i);
      }
      setBrokenSegments(newBroken);
      const timer = setTimeout(() => setBrokenSegments(new Set()), 400);
      prevHpRef.current = currentHp;
      return () => clearTimeout(timer);
    }
    prevHpRef.current = currentHp;
  }, [currentHp]);

  // Cap displayed segments for very high hull values
  const maxDisplaySegments = 10;
  const useCompact = totalHp > maxDisplaySegments;

  if (useCompact) {
    // Fallback to a compact bar with segment markers for high hull
    const fraction = totalHp > 0 ? currentHp / totalHp : 0;
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}>
        <div style={{
          flex: 1,
          height: '10px',
          background: 'var(--bg-tertiary)',
          borderRadius: '3px',
          overflow: 'hidden',
          minWidth: '40px',
          position: 'relative',
        }}>
          <div style={{
            width: `${fraction * 100}%`,
            height: '100%',
            background: ship.isDestroyed ? 'var(--text-muted)' : segmentColor,
            borderRadius: '3px',
            transition: 'width 0.3s ease-out, background 0.3s ease-out',
          }} />
        </div>
        <span style={{
          fontSize: '10px',
          color: ship.isDestroyed ? 'var(--text-muted)' : 'var(--text-secondary)',
          fontWeight: 600,
          minWidth: '24px',
          textDecoration: ship.isDestroyed ? 'line-through' : 'none',
        }}>
          {currentHp}/{totalHp}
        </span>
      </div>
    );
  }

  // Segment width scales with count
  const segWidth = totalHp <= 3 ? 16 : totalHp <= 6 ? 13 : 10;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    }}>
      <div style={{
        display: 'flex',
        gap: '2px',
      }}>
        {Array.from({ length: totalHp }, (_, i) => {
          const isFilled = i < currentHp;
          const justBroke = brokenSegments.has(i);
          return (
            <div
              key={i}
              className={justBroke ? 'bf-segment-break' : ''}
              style={{
                width: `${segWidth}px`,
                height: '12px',
                borderRadius: '2px',
                background: isFilled
                  ? (ship.isDestroyed ? 'var(--text-muted)' : segmentColor)
                  : 'var(--bg-tertiary)',
                border: isFilled
                  ? '1px solid rgba(255,255,255,0.1)'
                  : '1px solid rgba(255,255,255,0.03)',
                opacity: ship.isDestroyed ? 0.3 : 1,
                transition: 'background 0.3s ease-out, opacity 0.3s ease-out',
              }}
            />
          );
        })}
      </div>
      <span style={{
        fontSize: '10px',
        color: ship.isDestroyed ? 'var(--text-muted)' : 'var(--text-secondary)',
        fontWeight: 600,
        minWidth: '20px',
        textDecoration: ship.isDestroyed ? 'line-through' : 'none',
      }}>
        {currentHp}/{totalHp}
      </span>
    </div>
  );
}

// ── Ship Row with Hit Detection ──

function ShipRow({ ship, maxHull }: { ship: BattlefieldShip; maxHull: number }) {
  const prevDamageRef = useRef(ship.damage);
  const prevDestroyedRef = useRef(ship.isDestroyed);
  const prevRetreatedRef = useRef(ship.isRetreated);
  const [hitClass, setHitClass] = useState('');
  const [showImpact, setShowImpact] = useState(false);

  useEffect(() => {
    const tookDamage = ship.damage > prevDamageRef.current;
    const justDestroyed = ship.isDestroyed && !prevDestroyedRef.current;
    const justRetreated = ship.isRetreated && !prevRetreatedRef.current;

    if (justRetreated) {
      // No explosion animation for retreat
      prevRetreatedRef.current = ship.isRetreated;
      prevDamageRef.current = ship.damage;
      prevDestroyedRef.current = ship.isDestroyed;
      return;
    }

    if (justDestroyed) {
      setHitClass('bf-destroyed');
      setShowImpact(true);
      const impactTimer = setTimeout(() => setShowImpact(false), 500);
      prevDamageRef.current = ship.damage;
      prevDestroyedRef.current = ship.isDestroyed;
      prevRetreatedRef.current = ship.isRetreated;
      return () => clearTimeout(impactTimer);
    } else if (tookDamage) {
      setHitClass('bf-hit');
      setShowImpact(true);
      const hitTimer = setTimeout(() => setHitClass(''), 600);
      const impactTimer = setTimeout(() => setShowImpact(false), 500);
      prevDamageRef.current = ship.damage;
      prevDestroyedRef.current = ship.isDestroyed;
      prevRetreatedRef.current = ship.isRetreated;
      return () => { clearTimeout(hitTimer); clearTimeout(impactTimer); };
    }

    prevDamageRef.current = ship.damage;
    prevDestroyedRef.current = ship.isDestroyed;
    prevRetreatedRef.current = ship.isRetreated;
  }, [ship.damage, ship.isDestroyed, ship.isRetreated]);

  // Retreated ships: show "Escaped" indicator
  if (ship.isRetreated) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '2px 4px',
        borderRadius: '4px',
        opacity: 0.5,
      }}>
        <span style={{
          fontSize: '11px',
          color: 'var(--accent-blue)',
          fontStyle: 'italic',
        }}>
          Retreated
        </span>
      </div>
    );
  }

  return (
    <div
      className={hitClass}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 4px',
        borderRadius: '4px',
        position: 'relative',
        overflow: 'hidden',
        opacity: ship.isRetreating ? 0.6 : 1,
      }}
    >
      <HullSegments ship={ship} maxHull={maxHull} />

      {/* Retreating badge */}
      {ship.isRetreating && (
        <span style={{
          fontSize: '9px',
          color: 'var(--accent-blue)',
          fontWeight: 600,
          letterSpacing: '0.3px',
          flexShrink: 0,
        }}>
          RETREAT
        </span>
      )}

      {/* Impact burst overlay */}
      {showImpact && (
        <div
          className="bf-impact"
          style={{
            position: 'absolute',
            right: '30%',
            top: '50%',
            width: '16px',
            height: '16px',
            marginTop: '-8px',
            borderRadius: '50%',
            background: ship.isDestroyed
              ? 'radial-gradient(circle, rgba(255,160,60,0.9) 0%, rgba(255,74,106,0.6) 50%, transparent 100%)'
              : 'radial-gradient(circle, rgba(255,200,60,0.8) 0%, rgba(255,74,106,0.4) 60%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}

// ── Ship Group ──

function ShipGroupRow({ group, ownerId }: { group: BattlefieldShipGroup; ownerId: string }) {
  const isNpc = NPC_IDS.has(ownerId);
  return (
    <div style={{ marginBottom: '6px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2px',
      }}>
        <span style={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <ShipIcon
            shipType={isNpc ? ownerId : group.shipType}
            isNpc={isNpc}
            color="var(--text-primary)"
            size={22}
          />
          {group.displayName}
        </span>
        <span style={{
          fontSize: '10px',
          color: 'var(--text-muted)',
        }}>
          Init {group.stats.initiative}
        </span>
      </div>
      <StatsLine stats={group.stats} />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        marginTop: '4px',
      }}>
        {group.ships.map(ship => (
          <ShipRow key={ship.id} ship={ship} maxHull={group.stats.hullValue} />
        ))}
      </div>
    </div>
  );
}

// ── Faction Column ──

function FactionColumn({
  faction,
  isActive,
  isTarget,
}: {
  faction: BattlefieldFaction;
  isActive: boolean;
  isTarget: boolean;
}) {
  let borderColor = 'transparent';
  if (isActive) borderColor = faction.color;
  if (isTarget) borderColor = 'var(--accent-red)';

  return (
    <div style={{
      flex: 1,
      padding: '8px',
      borderRadius: '6px',
      background: isTarget
        ? 'rgba(255, 74, 106, 0.06)'
        : isActive
          ? 'rgba(255, 255, 255, 0.03)'
          : 'transparent',
      border: `1px solid ${borderColor}`,
      transition: 'background 0.2s, border-color 0.2s',
      minWidth: 0,
    }}>
      {/* Faction header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
        paddingBottom: '4px',
        borderBottom: `2px solid ${faction.color}`,
      }}>
        <span style={{
          fontSize: '13px',
          fontWeight: 'bold',
          color: faction.color,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {faction.displayName}
        </span>
        <span style={{
          fontSize: '10px',
          color: 'var(--text-muted)',
          flexShrink: 0,
          marginLeft: '4px',
        }}>
          {faction.totalAlive}/{faction.totalShips}
        </span>
      </div>

      {/* Ship groups */}
      {faction.shipGroups.length === 0 ? (
        <div style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          textAlign: 'center',
          padding: '8px 0',
        }}>
          No ships
        </div>
      ) : (
        faction.shipGroups.map(group => (
          <ShipGroupRow key={group.shipType} group={group} ownerId={faction.ownerId} />
        ))
      )}
    </div>
  );
}

// ── Root Component ──

interface BattlefieldDisplayProps {
  battlefield: BattlefieldState;
  actorOwner: string | null;
  targetOwner: string | null;
}

export function BattlefieldDisplay({ battlefield, actorOwner, targetOwner }: BattlefieldDisplayProps) {
  return (
    <div style={{
      display: 'flex',
      gap: '6px',
      alignItems: 'stretch',
      padding: '8px 0',
    }}>
      <FactionColumn
        faction={battlefield.left}
        isActive={actorOwner === battlefield.left.ownerId}
        isTarget={targetOwner === battlefield.left.ownerId}
      />
      <div style={{
        display: 'flex',
        alignItems: 'center',
        fontSize: '12px',
        color: 'var(--text-muted)',
        fontWeight: 'bold',
        padding: '0 2px',
        flexShrink: 0,
      }}>
        vs
      </div>
      <FactionColumn
        faction={battlefield.right}
        isActive={actorOwner === battlefield.right.ownerId}
        isTarget={targetOwner === battlefield.right.ownerId}
      />
    </div>
  );
}
