import { useState } from 'react';
import type { ShipOnBoard, BlueprintState, NpcBlueprintVariant } from '@eclipse/shared';
import {
  NpcType, ShipType, DieColor,
  ShipPartCategory, SHIP_PARTS_BY_ID, NPC_DEFINITIONS,
} from '@eclipse/shared';
import { Modal } from '../shared/Modal';
import { ShipIcon, NPC_COLOR } from '../shared/ShipIcon';

const NPC_IDS = new Set<string>([NpcType.Ancient, NpcType.Guardian, NpcType.GCDS]);

const SHIP_LABELS: Record<string, string> = {
  [ShipType.Interceptor]: 'Interceptor',
  [ShipType.Cruiser]: 'Cruiser',
  [ShipType.Dreadnought]: 'Dreadnought',
  [ShipType.Starbase]: 'Starbase',
};

const NPC_LABELS: Record<string, string> = {
  [NpcType.Ancient]: 'Ancient Ship',
  [NpcType.Guardian]: 'Guardian Ship',
  [NpcType.GCDS]: 'Galactic Center Defense System',
};

const DIE_COLOR_LABELS: Record<string, { label: string; color: string; name: string }> = {
  [DieColor.Yellow]: { label: 'Y', color: 'var(--accent-yellow)', name: 'Yellow' },
  [DieColor.Orange]: { label: 'O', color: 'var(--accent-orange)', name: 'Orange' },
  [DieColor.Red]: { label: 'R', color: 'var(--accent-red)', name: 'Red' },
  [DieColor.Blue]: { label: 'B', color: 'var(--accent-blue)', name: 'Blue' },
};

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

const PART_CATEGORY_COLORS: Record<string, string> = {
  [ShipPartCategory.Weapon]: 'var(--accent-red)',
  [ShipPartCategory.Energy]: 'var(--accent-yellow)',
  [ShipPartCategory.Drive]: 'var(--accent-green)',
  [ShipPartCategory.Computer]: 'var(--accent-blue)',
  [ShipPartCategory.Shield]: '#26c6da',
  [ShipPartCategory.Hull]: 'var(--text-secondary)',
};

// ── Part Slot (larger version for modal) ──

function PartSlotLarge({ partId, isFixed }: { partId: string | null; isFixed: boolean }) {
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
        width: '48px',
        height: '32px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: 600,
        fontFamily: 'var(--font-mono)',
        color: def ? 'var(--bg-primary)' : 'var(--text-muted)',
        background: def ? color : 'var(--bg-primary)',
        border: def
          ? `1.5px solid ${color}`
          : '1.5px dashed var(--border-color)',
        opacity: isFixed ? 0.7 : 1,
        cursor: 'default',
      }}
    >
      {abbrev ?? '\u00B7'}
      {hovered && def && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '6px',
          padding: '6px 10px',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: '4px',
          whiteSpace: 'nowrap',
          fontSize: '11px',
          color: 'var(--text-primary)',
          zIndex: 100,
          pointerEvents: 'none',
        }}>
          <div style={{ fontWeight: 600 }}>{def.name}</div>
          {(() => {
            const deltas: string[] = [];
            if (def.energyDelta !== 0) deltas.push(`Energy ${def.energyDelta > 0 ? '+' : ''}${def.energyDelta}`);
            if (def.initiativeDelta !== 0) deltas.push(`Init ${def.initiativeDelta > 0 ? '+' : ''}${def.initiativeDelta}`);
            if (def.computerDelta !== 0) deltas.push(`Comp ${def.computerDelta > 0 ? '+' : ''}${def.computerDelta}`);
            if (def.shieldDelta !== 0) deltas.push(`Shield ${def.shieldDelta > 0 ? '+' : ''}${def.shieldDelta}`);
            if (def.hullDelta !== 0) deltas.push(`Hull ${def.hullDelta > 0 ? '+' : ''}${def.hullDelta}`);
            if (def.movementDelta !== 0) deltas.push(`Move ${def.movementDelta > 0 ? '+' : ''}${def.movementDelta}`);
            return deltas.length > 0 ? (
              <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{deltas.join(' \u00B7 ')}</div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
}

// ── Stat Badge ──

function StatBadge({ label, value, prefix, color }: { label: string; value: number; prefix?: string; color?: string }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '6px 10px',
      background: 'var(--bg-primary)',
      borderRadius: '4px',
      border: '1px solid var(--border-color)',
      minWidth: '52px',
    }}>
      <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </span>
      <span style={{ fontSize: '16px', fontWeight: 'bold', color: color ?? 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
        {prefix && value > 0 ? prefix : ''}{value}
      </span>
    </div>
  );
}

// ── Weapon Row ──

function WeaponRow({ dieColor, dieCount, isMissile }: { dieColor: string; dieCount: number; isMissile: boolean }) {
  const dieInfo = DIE_COLOR_LABELS[dieColor];
  if (!dieInfo) return null;
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '4px 8px',
      background: 'var(--bg-primary)',
      borderRadius: '4px',
      border: '1px solid var(--border-color)',
    }}>
      <span style={{
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        background: dieInfo.color,
        display: 'inline-block',
        flexShrink: 0,
      }} />
      <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>
        {dieCount}x {dieInfo.name} {isMissile ? 'Missile' : 'Cannon'}
      </span>
    </div>
  );
}

// ── Main Modal ──

interface ShipInspectModalProps {
  ship: ShipOnBoard | null;
  blueprint: BlueprintState | null;
  npcVariant: NpcBlueprintVariant | null;
  ownerName: string;
  ownerColor: string;
  onClose: () => void;
  count?: number;
}

export function ShipInspectModal({ ship, blueprint, npcVariant, ownerName, ownerColor, onClose, count = 1 }: ShipInspectModalProps) {
  if (!ship) return null;

  const isNpc = NPC_IDS.has(ship.owner as string);
  const shipLabel = isNpc
    ? NPC_LABELS[ship.owner as string] ?? ship.owner
    : SHIP_LABELS[ship.type] ?? ship.type;

  const stats = blueprint?.computed ?? null;
  const npc = npcVariant;

  const accentColor = isNpc ? NPC_COLOR : ownerColor;

  return (
    <Modal isOpen title={count > 1 ? `${shipLabel} x${count}` : shipLabel} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', minWidth: '300px', maxWidth: '380px' }}>

        {/* Hero: large ship silhouette + owner */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          padding: '16px',
          background: 'var(--bg-primary)',
          borderRadius: '8px',
          border: `1px solid ${accentColor}`,
        }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <ShipIcon
              shipType={isNpc ? (ship.owner as string) : ship.type}
              isNpc={isNpc}
              color={accentColor}
              size={100}
            />
            {count > 1 && (
              <span style={{
                position: 'absolute',
                top: 0,
                right: 0,
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: 'var(--font-mono)',
                color: '#fff',
                textShadow: '0 0 4px rgba(0,0,0,0.8)',
              }}>
                x{count}
              </span>
            )}
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Owner
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: accentColor,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              justifyContent: 'center',
            }}>
              <span style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: accentColor,
              }} />
              {ownerName}
            </div>
          </div>

          {/* Damage indicator */}
          {ship.damage > 0 && (
            <div style={{
              padding: '3px 10px',
              borderRadius: '4px',
              background: 'rgba(255, 74, 106, 0.12)',
              color: 'var(--accent-red)',
              fontSize: '12px',
              fontWeight: 600,
            }}>
              {ship.damage} damage taken
            </div>
          )}
        </div>

        {/* Stats grid — for faction ships */}
        {stats && (
          <>
            <div style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              Combat Stats
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '6px',
            }}>
              <StatBadge label="Initiative" value={stats.initiative} />
              <StatBadge label="Movement" value={stats.movement} />
              <StatBadge label="Hull" value={stats.hullValue} />
              <StatBadge label="Computer" value={stats.computerValue} prefix="+" />
              <StatBadge label="Shield" value={stats.shieldValue} />
              <StatBadge
                label="Energy"
                value={stats.energyBalance}
                color={stats.energyBalance >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}
              />
            </div>
          </>
        )}

        {/* Stats grid — for NPC ships */}
        {npc && (
          <>
            <div style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              Combat Stats
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '6px',
            }}>
              <StatBadge label="Initiative" value={npc.initiative} />
              <StatBadge label="Hull" value={npc.hullPoints} />
              <StatBadge label="Computer" value={npc.computerBonus} prefix="+" />
              {npc.shieldBonus > 0 && <StatBadge label="Shield" value={npc.shieldBonus} />}
            </div>
          </>
        )}

        {/* Weapons — for faction ships */}
        {stats && (stats.weapons.length > 0 || stats.missiles.length > 0) && (
          <>
            <div style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              Weapons
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {stats.weapons.map((w, i) => (
                <WeaponRow key={`w-${i}`} dieColor={w.dieColor} dieCount={w.dieCount} isMissile={false} />
              ))}
              {stats.missiles.map((w, i) => (
                <WeaponRow key={`m-${i}`} dieColor={w.dieColor} dieCount={w.dieCount} isMissile />
              ))}
            </div>
          </>
        )}

        {/* Weapons — for NPC ships */}
        {npc && npc.weapons.length > 0 && (
          <>
            <div style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              Weapons
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {npc.weapons.map((w, i) => (
                <WeaponRow key={`npc-w-${i}`} dieColor={w.dieColor} dieCount={w.dieCount} isMissile={w.isMissile} />
              ))}
            </div>
          </>
        )}

        {/* Blueprint parts grid — only for faction ships */}
        {blueprint && (
          <>
            <div style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              Ship Parts
            </div>
            <div style={{
              display: 'flex',
              gap: '4px',
              flexWrap: 'wrap',
            }}>
              {blueprint.grid.flat().map((partId, i) => (
                <PartSlotLarge
                  key={i}
                  partId={partId}
                  isFixed={partId !== null && new Set(blueprint.fixedParts).has(partId)}
                />
              ))}
            </div>
            {/* Energy breakdown */}
            <div style={{
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: stats!.energyBalance >= 0 ? 'var(--accent-green)' : 'var(--accent-red)',
              padding: '4px 8px',
              background: 'var(--bg-primary)',
              borderRadius: '4px',
              textAlign: 'center',
            }}>
              {'\u26A1'} +{stats!.energyProduction} / {'\u2212'}{stats!.energyConsumption} = {stats!.energyBalance}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

/**
 * Given an NPC type, resolve the variant data from game config.
 */
export function getNpcVariant(npcType: string, config: { ancientBlueprintVariant?: number; guardianBlueprintVariant?: number; gcdsBlueprintVariant?: number }): NpcBlueprintVariant | null {
  const configKey = npcType === NpcType.Ancient
    ? 'ancientBlueprintVariant'
    : npcType === NpcType.Guardian
      ? 'guardianBlueprintVariant'
      : npcType === NpcType.GCDS
        ? 'gcdsBlueprintVariant'
        : null;
  if (!configKey) return null;
  const definition = NPC_DEFINITIONS[npcType as NpcType];
  if (!definition) return null;
  const variantIndex = ((config[configKey] ?? 1) - 1);
  return definition.blueprintVariants[variantIndex] ?? null;
}
