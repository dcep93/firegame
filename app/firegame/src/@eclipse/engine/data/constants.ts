import type { DieColor } from './enums';

// ── General Game Structure ──

export const TOTAL_ROUNDS = 8;
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 6;
export const TECH_TRACK_CAPACITY = 7;

// ── Ship Limits (per player) ──

export const SHIP_LIMITS = Object.freeze({
  interceptor: 8,
  cruiser: 4,
  dreadnought: 2,
  starbase: 4,
});

// ── Standard Building Costs ──

export const STANDARD_BUILDING_COSTS = Object.freeze({
  interceptor: 3,
  cruiser: 5,
  dreadnought: 8,
  starbase: 3,
  orbital: 4,
  monolith: 10,
});

// ── Tech Tile Copies (per type in the bag) ──

export const NON_RARE_TILE_COUNT = 4;
export const RARE_TILE_COUNT = 1;

// ── Tech Draw / Setup Counts (by player count) ──

export const TECH_SETUP_DRAW: Readonly<Record<number, number>> = Object.freeze({
  2: 12,
  3: 14,
  4: 16,
  5: 18,
  6: 20,
});

export const TECH_CLEANUP_DRAW: Readonly<Record<number, number>> = Object.freeze({
  2: 5,
  3: 6,
  4: 7,
  5: 8,
  6: 9,
});

// ── Outer Sector Counts (by player count) ──

export const OUTER_SECTOR_COUNTS: Readonly<Record<number, number>> = Object.freeze({
  2: 10,
  3: 14,
  4: 16,
  5: 18,
  6: 18,
});

// ── Influence Discs & Colony Ships ──

export const STANDARD_INFLUENCE_DISCS = 13;
export const STANDARD_COLONY_SHIPS = 3;
export const STANDARD_AMBASSADORS = 3;

// ── Upkeep Track (influence disc upkeep costs) ──

export const INFLUENCE_UPKEEP_TRACK: readonly number[] = Object.freeze([
  0,   // 0 discs placed
  0,   // 1
  0,   // 2
  -1,  // 3
  -2,  // 4
  -3,  // 5
  -5,  // 6
  -7,  // 7
  -10, // 8
  -13, // 9
  -17, // 10
  -21, // 11
  -25, // 12
  -30, // 13
]);

// ── Resource Production Tracks ──

export const MATERIALS_PRODUCTION_TRACK: readonly number[] = Object.freeze([
  2, 3, 4, 6, 8, 10, 12, 15, 18, 21, 24, 28,
]);

export const SCIENCE_PRODUCTION_TRACK: readonly number[] = Object.freeze([
  2, 3, 4, 6, 8, 10, 12, 15, 18, 21, 24, 28,
]);

export const MONEY_PRODUCTION_TRACK: readonly number[] = Object.freeze([
  2, 3, 4, 6, 8, 10, 12, 15, 18, 21, 24, 28,
]);

// ── Population Cubes ──

export const POPULATION_CUBES_PER_RESOURCE = Object.freeze({
  materials: 11,
  science: 11,
  money: 11,
});

// ── Combat ──

export const DIE_HIT_THRESHOLD = 6;
export const DIE_FACES = 6;

export const DICE_DAMAGE: Readonly<Record<DieColor, number>> = Object.freeze({
  yellow: 1,
  orange: 2,
  blue: 3,
  red: 4,
} as Record<DieColor, number>);

// ── Scoring ──

export const DISCOVERY_TILE_VP = 2;
export const MONOLITH_VP = 3;
export const AMBASSADOR_VP = 1;
export const WARP_PORTAL_VP = 1;
// ── Passing ──

export const PASS_BONUS_MONEY = 2;

// ── Default Blueprint Slot Counts ──

export const STANDARD_BLUEPRINT_SLOT_COUNTS = Object.freeze({
  interceptor: 4,
  cruiser: 6,
  dreadnought: 8,
  starbase: 5,
});
