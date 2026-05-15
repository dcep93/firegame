import { DieColor, NpcType } from '../enums';
import type { NpcDefinition } from '../types/npc';

export const NPC_DEFINITIONS: Readonly<Record<NpcType, NpcDefinition>> = Object.freeze({
  [NpcType.Ancient]: {
    type: NpcType.Ancient,
    name: 'Ancient Ship',
    vpReward: 0,
    grantsDiscovery: true,
    blueprintVariants: [
      {
        variantId: 'ancient_a',
        initiative: 2,
        hullPoints: 1,
        computerBonus: 1,
        shieldBonus: 0,
        weapons: [
          { dieColor: DieColor.Yellow, dieCount: 2, isMissile: false },
        ],
        movement: 0,
      },
      {
        variantId: 'ancient_b',
        initiative: 1,
        hullPoints: 2,
        computerBonus: 1,
        shieldBonus: 0,
        weapons: [
          { dieColor: DieColor.Orange, dieCount: 1, isMissile: false },
        ],
        movement: 0,
      },
    ],
  },

  [NpcType.Guardian]: {
    type: NpcType.Guardian,
    name: 'Guardian Ship',
    vpReward: 0,
    grantsDiscovery: true,
    blueprintVariants: [
      {
        variantId: 'guardian_a',
        initiative: 3,
        hullPoints: 3,
        computerBonus: 2,
        shieldBonus: 0,
        weapons: [
          { dieColor: DieColor.Yellow, dieCount: 3, isMissile: false },
        ],
        movement: 0,
      },
      {
        variantId: 'guardian_b',
        initiative: 1,
        hullPoints: 3,
        computerBonus: 1,
        shieldBonus: 0,
        weapons: [
          { dieColor: DieColor.Orange, dieCount: 2, isMissile: true },
          { dieColor: DieColor.Red, dieCount: 1, isMissile: false },
        ],
        movement: 0,
      },
    ],
  },

  [NpcType.GCDS]: {
    type: NpcType.GCDS,
    name: 'Galactic Center Defense System',
    vpReward: 0,
    grantsDiscovery: true,
    blueprintVariants: [
      {
        variantId: 'gcds_a',
        initiative: 0,
        hullPoints: 7,
        computerBonus: 2,
        shieldBonus: 0,
        weapons: [
          { dieColor: DieColor.Yellow, dieCount: 4, isMissile: false },
        ],
        movement: 0,
      },
      {
        variantId: 'gcds_b',
        initiative: 2,
        hullPoints: 3,
        computerBonus: 2,
        shieldBonus: 0,
        weapons: [
          { dieColor: DieColor.Yellow, dieCount: 4, isMissile: true },
          { dieColor: DieColor.Red, dieCount: 1, isMissile: false },
        ],
        movement: 0,
      },
    ],
  },
});

export const ALL_NPC_DEFINITIONS: readonly NpcDefinition[] = Object.freeze(
  Object.values(NPC_DEFINITIONS),
);
