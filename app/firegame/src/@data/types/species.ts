import { PlayerColor, ReputationSlotType, ShipPartSlotType, ShipType, SpeciesId } from '../enums';
import { ActivationLimits, Resources } from './common';

export interface BlueprintSlot {
  readonly slotType: ShipPartSlotType;
  readonly defaultPart: string | null;
}

export interface BlueprintDefinition {
  readonly shipType: ShipType;
  readonly slots: readonly BlueprintSlot[];
  readonly baseInitiative: number;
  readonly baseEnergy: number;
  readonly baseMovement: number;
  readonly baseHullPoints: number;
  readonly baseComputer: number;
  readonly baseShield: number;
}

export interface StartingFleet {
  readonly shipType: ShipType;
  readonly count: number;
}

export interface BuildingCosts {
  readonly [ShipType.Interceptor]: number;
  readonly [ShipType.Cruiser]: number;
  readonly [ShipType.Dreadnought]: number;
  readonly [ShipType.Starbase]: number;
  readonly orbital: number;
  readonly monolith: number;
}

export interface SpecialAbility {
  readonly id: string;
  readonly description: string;
  readonly effectType: string;
  readonly params?: Record<string, unknown>;
}

export interface SpeciesDefinition {
  readonly id: SpeciesId;
  readonly color: PlayerColor;
  readonly name: string;
  readonly subtitle: string;
  readonly homeSectorId: string;
  readonly startingResources: Resources;
  readonly startingStorage: Resources;
  readonly tradeRate: number;
  readonly colonyShips: number;
  readonly influenceDiscs: number;
  readonly ambassadors: number;
  readonly startingTechs: readonly string[];
  readonly activationLimits: ActivationLimits;
  readonly startingFleet: readonly StartingFleet[];
  readonly blueprintOverrides: Partial<Record<ShipType, Partial<BlueprintDefinition>>>;
  readonly buildingCosts: BuildingCosts;
  readonly specialAbilities: readonly SpecialAbility[];
  readonly reputationSlots: readonly ReputationSlotType[];
  readonly baseInitiativeOrder: number;
}
