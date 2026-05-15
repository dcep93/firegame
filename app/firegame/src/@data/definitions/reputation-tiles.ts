import type { ReputationTileDefinition } from '../types/reputation';

export const REPUTATION_TILES: readonly ReputationTileDefinition[] = Object.freeze([
  { value: 1, count: 12 },
  { value: 2, count: 10 },
  { value: 3, count: 7 },
  { value: 4, count: 1 },
]);

export function createReputationBag(): readonly number[] {
  const bag: number[] = [];
  for (const tile of REPUTATION_TILES) {
    for (let i = 0; i < tile.count; i++) {
      bag.push(tile.value);
    }
  }
  return Object.freeze(bag);
}
