import { DieColor } from '../enums';
import type { DieDefinition } from '../types/dice';

export const DICE: Readonly<Record<DieColor, DieDefinition>> = Object.freeze({
  [DieColor.Yellow]: {
    color: DieColor.Yellow,
    damage: 1,
    faces: [
      { value: 0, isBurst: false, isMiss: true },
      { value: 2, isBurst: false, isMiss: false },
      { value: 3, isBurst: false, isMiss: false },
      { value: 4, isBurst: false, isMiss: false },
      { value: 5, isBurst: false, isMiss: false },
      { value: 0, isBurst: true, isMiss: false },
    ],
  },
  [DieColor.Orange]: {
    color: DieColor.Orange,
    damage: 2,
    faces: [
      { value: 0, isBurst: false, isMiss: true },
      { value: 2, isBurst: false, isMiss: false },
      { value: 3, isBurst: false, isMiss: false },
      { value: 4, isBurst: false, isMiss: false },
      { value: 5, isBurst: false, isMiss: false },
      { value: 0, isBurst: true, isMiss: false },
    ],
  },
  [DieColor.Blue]: {
    color: DieColor.Blue,
    damage: 3,
    faces: [
      { value: 0, isBurst: false, isMiss: true },
      { value: 2, isBurst: false, isMiss: false },
      { value: 3, isBurst: false, isMiss: false },
      { value: 4, isBurst: false, isMiss: false },
      { value: 5, isBurst: false, isMiss: false },
      { value: 0, isBurst: true, isMiss: false },
    ],
  },
  [DieColor.Red]: {
    color: DieColor.Red,
    damage: 4,
    faces: [
      { value: 0, isBurst: false, isMiss: true },
      { value: 2, isBurst: false, isMiss: false },
      { value: 3, isBurst: false, isMiss: false },
      { value: 4, isBurst: false, isMiss: false },
      { value: 5, isBurst: false, isMiss: false },
      { value: 0, isBurst: true, isMiss: false },
    ],
  },
});

export const ALL_DICE: readonly DieDefinition[] = Object.freeze(
  Object.values(DICE),
);
