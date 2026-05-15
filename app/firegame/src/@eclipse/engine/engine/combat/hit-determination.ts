import { DIE_HIT_THRESHOLD } from '@data/constants';
import type { DieColor } from '@data/enums';

export interface RollResult {
  readonly dieColor: DieColor;
  readonly faceIndex: number; // 0-5
  readonly faceValue: number;
  readonly isBurst: boolean;
  readonly isMiss: boolean;
}

export function isHit(
  roll: RollResult,
  attackerComputer: number,
  targetShield: number,
): boolean {
  if (roll.isBurst) return true;
  if (roll.isMiss) return false;
  return roll.faceValue + attackerComputer - targetShield >= DIE_HIT_THRESHOLD;
}

export function getHits(
  rolls: readonly RollResult[],
  attackerComputer: number,
  targetShield: number,
): readonly RollResult[] {
  return rolls.filter((r) => isHit(r, attackerComputer, targetShield));
}
