import { DICE } from '@data/definitions/dice';
import type { DieColor } from '@data/enums';
import type { GameState, WeaponSummary } from '../types';
import { nextInt } from '../utils/rng';
import type { RollResult } from './hit-determination';

export function rollSingleDie(
  state: GameState,
  color: DieColor,
): { roll: RollResult; state: GameState } {
  const die = DICE[color];
  const [faceIndex, newRng] = nextInt(state.rngState, 0, 5);
  const face = die.faces[faceIndex]!;

  const roll: RollResult = {
    dieColor: color,
    faceIndex,
    faceValue: face.value,
    isBurst: face.isBurst,
    isMiss: face.isMiss,
  };

  return { roll, state: { ...state, rngState: newRng } };
}

export function rollWeaponDice(
  state: GameState,
  weapons: readonly WeaponSummary[],
): { rolls: readonly RollResult[]; state: GameState } {
  const rolls: RollResult[] = [];
  let current = state;

  for (const weapon of weapons) {
    for (let i = 0; i < weapon.dieCount; i++) {
      const result = rollSingleDie(current, weapon.dieColor);
      rolls.push(result.roll);
      current = result.state;
    }
  }

  return { rolls, state: current };
}
