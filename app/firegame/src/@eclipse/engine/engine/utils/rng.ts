import type { RngState } from '../types';

/** Create initial RNG state from a seed */
export function createRng(seed: number): RngState {
  return { seed, callCount: 0 };
}

/** Mulberry32 PRNG — returns a float in [0, 1) and advanced state */
export function nextFloat(state: RngState): [number, RngState] {
  const value = mulberry32(state.seed, state.callCount);
  return [value, { seed: state.seed, callCount: state.callCount + 1 }];
}

/** Returns a random integer in [min, max] (inclusive) and advanced state */
export function nextInt(
  state: RngState,
  min: number,
  max: number,
): [number, RngState] {
  const [float, newState] = nextFloat(state);
  const value = min + Math.floor(float * (max - min + 1));
  return [value, newState];
}

/** Fisher-Yates shuffle — returns a shuffled copy and advanced state */
export function shuffle<T>(
  state: RngState,
  array: readonly T[],
): [readonly T[], RngState] {
  const result = [...array];
  let currentState = state;

  for (let i = result.length - 1; i > 0; i--) {
    const [j, newState] = nextInt(currentState, 0, i);
    currentState = newState;
    const temp = result[i]!;
    result[i] = result[j]!;
    result[j] = temp;
  }

  return [result, currentState];
}

/** Draw count items from a bag — returns [drawn, remaining, newState] */
export function drawFromBag<T>(
  state: RngState,
  bag: readonly T[],
  count: number,
): [readonly T[], readonly T[], RngState] {
  const [shuffled, newState] = shuffle(state, bag);
  const drawn = shuffled.slice(0, count);
  const remaining = shuffled.slice(count);
  return [drawn, remaining, newState];
}

/** Mulberry32 internal: compute the nth random float from a seed */
function mulberry32(seed: number, callCount: number): number {
  let t = seed >>> 0;
  // Fast-forward through callCount iterations
  for (let i = 0; i <= callCount; i++) {
    t = (t + 0x6d2b79f5) | 0;
  }
  let result = Math.imul(t ^ (t >>> 15), t | 1);
  result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
  return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
}
