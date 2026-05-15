import type { NpcType } from '@data/enums';
import type { HexCoord } from '@data/types/common';
import type { GameState, PlayerId } from '../types';
import {
  getOwnerShipsInSector,
  getShipCombatStats,
} from './combat-helpers';
import type { DamageAssignment } from './damage';
import { applyDamage } from './damage';
import { rollWeaponDice } from './dice-rolling';
import type { RollResult } from './hit-determination';
import type { CombatUnit } from './initiative';
import { completeRetreat, initiateRetreat } from './retreat';

export type CombatDecision =
  | { readonly type: 'ATTACK'; readonly damageAssignments: readonly DamageAssignment[] }
  | { readonly type: 'RETREAT'; readonly retreatTarget: HexCoord };

export function rollAttackDice(
  state: GameState,
  _sectorKey: string,
  unit: CombatUnit,
): { rolls: readonly RollResult[]; state: GameState } {
  // Get non-missile weapons for this unit's ship type
  const stats = getShipCombatStats(unit.ships[0]!, state);

  const allRolls: RollResult[] = [];
  let current = state;

  // Roll for each active ship in the unit
  const activeShips = unit.ships.filter((s) => !s.isRetreating);
  for (let i = 0; i < activeShips.length; i++) {
    const result = rollWeaponDice(current, stats.weapons);
    allRolls.push(...result.rolls);
    current = result.state;
  }

  return { rolls: allRolls, state: current };
}

export function applyUnitDecision(
  state: GameState,
  sectorKey: string,
  unit: CombatUnit,
  decision: CombatDecision,
  _attackerId: PlayerId | NpcType,
  _defenderId: PlayerId | NpcType,
): GameState {
  if (decision.type === 'ATTACK') {
    return applyDamage(state, sectorKey, decision.damageAssignments, unit.owner);
  }

  // RETREAT
  return initiateRetreat(
    state,
    unit.owner as PlayerId,
    unit.shipType,
    decision.retreatTarget,
    sectorKey,
  );
}

export function completePendingRetreats(
  state: GameState,
  sectorKey: string,
  unit: CombatUnit,
): GameState {
  if (!unit.ships.some((s) => s.isRetreating)) return state;

  return completeRetreat(
    state,
    unit.owner as PlayerId,
    unit.shipType,
    sectorKey,
  );
}

export function isBattleOver(
  state: GameState,
  sectorKey: string,
  attackerId: PlayerId | NpcType,
  defenderId: PlayerId | NpcType,
): boolean {
  // Include retreating ships — battle isn't over while ships are still being shot at
  const attackerShips = getOwnerShipsInSector(state, sectorKey, attackerId);
  const defenderShips = getOwnerShipsInSector(state, sectorKey, defenderId);

  return attackerShips.length === 0 || defenderShips.length === 0;
}
