import { DieColor } from '../enums';

export interface DieFace {
  readonly value: number;
  readonly isBurst: boolean;
  readonly isMiss: boolean;
}

export interface DieDefinition {
  readonly color: DieColor;
  readonly damage: number;
  readonly faces: readonly DieFace[];
}
