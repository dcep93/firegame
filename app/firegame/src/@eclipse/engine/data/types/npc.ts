import { DieColor, NpcType } from '../enums';

export interface NpcWeapon {
  readonly dieColor: DieColor;
  readonly dieCount: number;
  readonly isMissile: boolean;
}

export interface NpcBlueprintVariant {
  readonly variantId: string;
  readonly initiative: number;
  readonly hullPoints: number;
  readonly computerBonus: number;
  readonly shieldBonus: number;
  readonly weapons: readonly NpcWeapon[];
  readonly movement: number;
}

export interface NpcDefinition {
  readonly type: NpcType;
  readonly name: string;
  readonly blueprintVariants: readonly NpcBlueprintVariant[];
  readonly vpReward: number;
  readonly grantsDiscovery: boolean;
}
