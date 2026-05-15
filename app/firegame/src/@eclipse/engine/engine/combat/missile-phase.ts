import type { NpcType } from '@data/enums';
import type { GameState, PlayerId } from '../types';
import { getShipCombatStats } from './combat-helpers';
import type { DamageAssignment } from './damage';
import { applyDamage } from './damage';
import { rollWeaponDice } from './dice-rolling';
import type { RollResult } from './hit-determination';
import type { CombatUnit } from './initiative';

export function rollMissileDice(
  state: GameState,
  _sectorKey: string,
  initiativeOrder: readonly CombatUnit[],
): { rollsByUnit: ReadonlyMap<number, readonly RollResult[]>; state: GameState } {
  const rollsByUnit = new Map<number, readonly RollResult[]>();
  let current = state;

  for (let i = 0; i < initiativeOrder.length; i++) {
    const unit = initiativeOrder[i]!;

    // Get missile weapons for this unit's ship type
    const stats = getShipCombatStats(unit.ships[0]!, current);
    if (stats.missiles.length === 0) continue;

    // Roll for each ship in the unit
    const allRolls: RollResult[] = [];
    for (let shipIndex = 0; shipIndex < unit.ships.length; shipIndex++) {
      const result = rollWeaponDice(current, stats.missiles);
      allRolls.push(...result.rolls);
      current = result.state;
    }

    if (allRolls.length > 0) {
      rollsByUnit.set(i, allRolls);
    }
  }

  return { rollsByUnit, state: current };
}

export function applyMissileDamage(
  state: GameState,
  sectorKey: string,
  allAssignments: readonly {
    owner: PlayerId | NpcType;
    assignments: readonly DamageAssignment[];
  }[],
): GameState {
  let result = state;

  for (const { owner, assignments } of allAssignments) {
    result = applyDamage(result, sectorKey, assignments, owner);
  }

  return result;
}
