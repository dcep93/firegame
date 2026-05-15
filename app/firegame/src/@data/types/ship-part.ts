import { DieColor, ShipPartCategory } from '../enums';

export interface WeaponProfile {
  readonly dieColor: DieColor;
  readonly dieCount: number;
  readonly isMissile: boolean;
}

export interface ShipPartDefinition {
  readonly id: string;
  readonly name: string;
  readonly category: ShipPartCategory;
  readonly energyDelta: number;
  readonly initiativeDelta: number;
  readonly computerDelta: number;
  readonly shieldDelta: number;
  readonly hullDelta: number;
  readonly movementDelta: number;
  readonly weapon?: WeaponProfile;
  readonly isRare: boolean;
  readonly isDiscoveryOnly: boolean;
  readonly unlockedByTech?: string;
}
