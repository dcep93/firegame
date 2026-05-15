import type { ShipOnBoard, BlueprintState, NpcBlueprintVariant } from '@eclipse/shared';
import { NpcType, DieColor, ShipType } from '@eclipse/shared';
import { ShipIcon, NPC_COLOR } from '../shared/ShipIcon';

const NPC_IDS = new Set<string>([NpcType.Ancient, NpcType.Guardian, NpcType.GCDS]);

const SHIP_LABELS: Record<string, string> = {
  [ShipType.Interceptor]: 'Interceptor',
  [ShipType.Cruiser]: 'Cruiser',
  [ShipType.Dreadnought]: 'Dreadnought',
  [ShipType.Starbase]: 'Starbase',
};

const NPC_LABELS: Record<string, string> = {
  [NpcType.Ancient]: 'Ancient',
  [NpcType.Guardian]: 'Guardian',
  [NpcType.GCDS]: 'GCDS',
};

const DIE_COLOR_CSS: Record<string, string> = {
  [DieColor.Yellow]: 'var(--accent-yellow)',
  [DieColor.Orange]: 'var(--accent-orange)',
  [DieColor.Red]: 'var(--accent-red)',
  [DieColor.Blue]: 'var(--accent-blue)',
};

interface ShipTooltipProps {
  ship: ShipOnBoard;
  blueprint: BlueprintState | null;
  npcVariant: NpcBlueprintVariant | null;
  ownerName: string;
  ownerColor: string;
  x: number;
  y: number;
  count?: number;
}

export function ShipTooltip({ ship, blueprint, npcVariant, ownerName, ownerColor, x, y, count = 1 }: ShipTooltipProps) {
  const isNpc = NPC_IDS.has(ship.owner as string);
  const shipLabel = isNpc
    ? NPC_LABELS[ship.owner as string] ?? ship.owner
    : SHIP_LABELS[ship.type] ?? ship.type;

  const stats = blueprint?.computed ?? null;
  const npc = npcVariant;
  const accent = isNpc ? NPC_COLOR : ownerColor;

  return (
    <div style={{
      position: 'fixed',
      left: `${x}px`,
      top: `${y - 10}px`,
      transform: 'translate(-50%, -100%)',
      zIndex: 2000,
      pointerEvents: 'none',
      minWidth: '180px',
      maxWidth: '260px',
    }}>
      <div style={{
        background: 'var(--bg-primary)',
        border: `1px solid ${accent}`,
        borderRadius: '6px',
        padding: '8px 10px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '6px',
          paddingBottom: '4px',
          borderBottom: `1px solid ${accent}`,
        }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <ShipIcon
              shipType={isNpc ? (ship.owner as string) : ship.type}
              isNpc={isNpc}
              color={ownerColor}
              size={28}
            />
            {count > 1 && (
              <span style={{
                position: 'absolute',
                top: -2,
                right: -2,
                fontSize: '9px',
                fontWeight: 'bold',
                fontFamily: 'var(--font-mono)',
                color: '#fff',
                textShadow: '0 0 3px rgba(0,0,0,0.8)',
              }}>
                x{count}
              </span>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: accent }}>
              {shipLabel}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              {ownerName}
            </div>
          </div>
        </div>

        {/* Quick stats */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '3px 8px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            marginBottom: '4px',
          }}>
            <StatCell label="Init" value={stats.initiative} />
            <StatCell label="Move" value={stats.movement} />
            <StatCell label="Hull" value={stats.hullValue} />
            <StatCell label="Comp" value={stats.computerValue} prefix="+" />
            <StatCell label="Shield" value={stats.shieldValue} />
            <StatCell label="Energy" value={stats.energyBalance} color={stats.energyBalance >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'} />
          </div>
        )}

        {npc && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '3px 8px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            marginBottom: '4px',
          }}>
            <StatCell label="Init" value={npc.initiative} />
            <StatCell label="Hull" value={npc.hullPoints} />
            <StatCell label="Comp" value={npc.computerBonus} prefix="+" />
          </div>
        )}

        {/* Weapons */}
        {stats && (stats.weapons.length > 0 || stats.missiles.length > 0) && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
            {[...stats.weapons, ...stats.missiles].map((w, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '10px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: DIE_COLOR_CSS[w.dieColor] ?? 'var(--text-muted)', display: 'inline-block' }} />
                <span style={{ color: 'var(--text-secondary)' }}>{w.dieCount > 1 ? `\u00d7${w.dieCount}` : ''}</span>
              </span>
            ))}
          </div>
        )}

        {npc && npc.weapons.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
            {npc.weapons.map((w, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '10px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: DIE_COLOR_CSS[w.dieColor] ?? 'var(--text-muted)', display: 'inline-block' }} />
                <span style={{ color: 'var(--text-secondary)' }}>{w.dieCount > 1 ? `\u00d7${w.dieCount}` : ''}{w.isMissile ? 'm' : ''}</span>
              </span>
            ))}
          </div>
        )}

        {ship.damage > 0 && (
          <div style={{ marginTop: '4px', fontSize: '10px', color: 'var(--accent-red)', fontWeight: 600 }}>
            {ship.damage} damage taken
          </div>
        )}

        {/* Click hint */}
        <div style={{ marginTop: '6px', fontSize: '9px', color: 'var(--text-muted)', textAlign: 'center', opacity: 0.7 }}>
          Click for full details
        </div>
      </div>
    </div>
  );
}

function StatCell({ label, value, prefix, color }: { label: string; value: number; prefix?: string; color?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2px' }}>
      <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{label}</span>
      <span style={{ color: color ?? 'var(--text-primary)', fontWeight: 600 }}>
        {prefix && value > 0 ? prefix : ''}{value}
      </span>
    </div>
  );
}
