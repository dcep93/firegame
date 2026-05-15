import type { ShipPartDefinition } from '@data/types/ship-part';
import type { BlueprintDefinition } from '@data/types/species';
import type { ShipType } from '@data/enums';
import type {
  BlueprintState,
  ComputedBlueprintStats,
  WeaponSummary,
} from '../types';

/**
 * Compute aggregate stats from a blueprint's grid, fixed parts, base definition,
 * and optional species overrides.
 */
export function computeBlueprintStats(
  grid: readonly (readonly (string | null)[])[],
  fixedParts: readonly string[],
  baseDef: BlueprintDefinition,
  speciesOverrides: Partial<BlueprintDefinition> | undefined,
  shipParts: Readonly<Record<string, ShipPartDefinition>>,
): ComputedBlueprintStats {
  // Collect all part IDs from grid + fixed parts
  const allPartIds: string[] = [];
  for (const row of grid) {
    for (const cell of row) {
      if (cell !== null) {
        allPartIds.push(cell);
      }
    }
  }
  for (const fp of fixedParts) {
    allPartIds.push(fp);
  }

  // Sum deltas from all parts
  let energyProduction = 0;
  let energyConsumption = 0;
  let initiative = 0;
  let movement = 0;
  let hullValue = 0;
  let shieldValue = 0;
  let computerValue = 0;
  const weapons: WeaponSummary[] = [];
  const missiles: WeaponSummary[] = [];

  for (const partId of allPartIds) {
    const part = shipParts[partId];
    if (!part) continue;

    if (part.energyDelta > 0) {
      energyProduction += part.energyDelta;
    } else {
      energyConsumption += Math.abs(part.energyDelta);
    }

    initiative += part.initiativeDelta;
    movement += part.movementDelta;
    hullValue += part.hullDelta;
    shieldValue += part.shieldDelta;
    computerValue += part.computerDelta;

    if (part.weapon) {
      const summary: WeaponSummary = {
        dieColor: part.weapon.dieColor,
        dieCount: part.weapon.dieCount,
        damage: part.weapon.dieCount, // each die = 1 hit potential
      };
      if (part.weapon.isMissile) {
        missiles.push(summary);
      } else {
        weapons.push(summary);
      }
    }
  }

  // Add base stats (with species overrides applied)
  const baseEnergy = speciesOverrides?.baseEnergy ?? baseDef.baseEnergy;
  const baseInitiative = speciesOverrides?.baseInitiative ?? baseDef.baseInitiative;
  const baseMovement = speciesOverrides?.baseMovement ?? baseDef.baseMovement;
  const baseHullPoints = speciesOverrides?.baseHullPoints ?? baseDef.baseHullPoints;
  const baseComputer = speciesOverrides?.baseComputer ?? baseDef.baseComputer;
  const baseShield = speciesOverrides?.baseShield ?? baseDef.baseShield;

  energyProduction += baseEnergy;
  initiative += baseInitiative;
  movement += baseMovement;
  hullValue += baseHullPoints;
  shieldValue += baseShield;
  computerValue += baseComputer;

  return {
    initiative,
    movement,
    hullValue,
    shieldValue,
    computerValue,
    energyProduction,
    energyConsumption,
    energyBalance: energyProduction - energyConsumption,
    weapons,
    missiles,
  };
}

/**
 * Create the initial blueprint for a ship type, using defaults + species overrides.
 */
export function createInitialBlueprint(
  shipType: ShipType,
  defaultDef: BlueprintDefinition,
  speciesOverrides: Partial<BlueprintDefinition> | undefined,
  shipParts: Readonly<Record<string, ShipPartDefinition>>,
): BlueprintState {
  // Use overridden slots if species provides them, otherwise default
  const slots = speciesOverrides?.slots ?? defaultDef.slots;

  // Build 1D grid (stored as single row) from slot definitions
  const gridRow: (string | null)[] = slots.map((slot) => slot.defaultPart);
  const grid: readonly (readonly (string | null)[])[] = [gridRow];

  // Fixed parts: none for initial blueprints (all parts are in the grid)
  const fixedParts: readonly string[] = [];

  const computed = computeBlueprintStats(
    grid,
    fixedParts,
    defaultDef,
    speciesOverrides,
    shipParts,
  );

  return {
    shipType,
    grid,
    fixedParts,
    computed,
  };
}
