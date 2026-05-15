import { useGameState } from '../../hooks/useGameState';
import { NpcType, DieColor, NPC_DEFINITIONS } from '@eclipse/shared';
import type { NpcBlueprintVariant } from '@eclipse/shared';
import { ShipIcon } from './ShipIcon';

const DIE_COLOR_LABELS: Partial<Record<DieColor, { label: string; color: string }>> = {
  [DieColor.Yellow]: { label: 'Y', color: 'var(--accent-yellow)' },
  [DieColor.Orange]: { label: 'O', color: 'var(--accent-orange)' },
  [DieColor.Red]: { label: 'R', color: 'var(--accent-red)' },
  [DieColor.Blue]: { label: 'B', color: 'var(--accent-blue)' },
};

const NPC_ENTRIES: readonly { npcType: NpcType; label: string; configKey: 'ancientBlueprintVariant' | 'guardianBlueprintVariant' | 'gcdsBlueprintVariant' }[] = [
  { npcType: NpcType.Ancient, label: 'Ancient', configKey: 'ancientBlueprintVariant' },
  { npcType: NpcType.Guardian, label: 'Guardian', configKey: 'guardianBlueprintVariant' },
  { npcType: NpcType.GCDS, label: 'GCDS', configKey: 'gcdsBlueprintVariant' },
];

function VariantCard({ label, variant, npcType }: { label: string; variant: NpcBlueprintVariant; npcType: NpcType }) {
  return (
    <div style={{
      padding: '6px 8px',
      background: 'var(--bg-tertiary)',
      borderRadius: '4px',
      border: '1px solid var(--border-color)',
      marginBottom: '4px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <ShipIcon shipType={npcType} isNpc size={20} />
          {label}
        </span>
        <span style={{
          fontSize: '9px',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {variant.variantId.endsWith('_a') ? 'Normal' : 'Advanced'}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '10px', color: 'var(--text-muted)' }}>
        {variant.weapons.map((w, i) => {
          const dieInfo = DIE_COLOR_LABELS[w.dieColor as DieColor];
          if (!dieInfo) return null;
          return (
            <span key={i} style={{ color: dieInfo.color }}>
              {w.dieCount}x{dieInfo.label}{w.isMissile ? 'm' : ''}
            </span>
          );
        })}
        <span>H:{variant.hullPoints}</span>
        <span>C:+{variant.computerBonus}</span>
        <span>I:{variant.initiative}</span>
      </div>
    </div>
  );
}

export function NpcBlueprints({ headless = false }: { headless?: boolean } = {}) {
  const { filteredState } = useGameState();

  if (!filteredState) return null;

  const { config } = filteredState;

  return (
    <>
      {!headless && (
        <h3 style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          marginTop: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-sm)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          NPC Blueprints
        </h3>
      )}
      {NPC_ENTRIES.map(({ npcType, label, configKey }) => {
        const variantIndex = (config[configKey] ?? 1) - 1;
        const definition = NPC_DEFINITIONS[npcType];
        const variant = definition.blueprintVariants[variantIndex];
        if (!variant) return null;
        return <VariantCard key={npcType} label={label} variant={variant} npcType={npcType} />;
      })}
    </>
  );
}
