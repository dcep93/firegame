import { SHIP_LIMITS } from '@eclipse/shared';
import type { ShipType, BlueprintState } from '@eclipse/shared';
import { BlueprintCard } from './BlueprintCard';

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

interface ShipBlueprintsProps {
  blueprints: Readonly<Record<string, BlueprintState>>;
  shipSupply: Readonly<Record<string, number>>;
  expanded?: boolean;
}

export function ShipBlueprints({ blueprints, shipSupply, expanded }: ShipBlueprintsProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-sm)',
    }}>
      {SHIP_ORDER.map(shipType => {
        const blueprint = blueprints[shipType];
        if (!blueprint) return null;
        const total = SHIP_TOTALS[shipType] ?? 0;
        const supply = shipSupply[shipType] ?? 0;
        return (
          <BlueprintCard
            key={shipType}
            shipType={shipType}
            blueprint={blueprint}
            supply={supply}
            total={total}
            expanded={expanded}
          />
        );
      })}
    </div>
  );
}
