import { Rank, Track } from "./gameTypes";

const RawFactions = {
  blue: {
    research: [],
  },
  green: {
    research: [],
  },
  white: {
    research: [],
  },
  black: {
    research: [],
  },
  red: {
    research: [],
  },
  yellow: {
    research: [],
  },
};
export type Faction = keyof typeof RawFactions;
export const Factions: { [key: string]: { research: Science[] } } = RawFactions;

const RawDiamonds = {
  monolith: {},
  _8_gold: {},
};
export type Diamond = keyof typeof RawDiamonds;
export const Diamonds: { [key: string]: {} } = RawDiamonds;

const RawTiles = { "100": { rank: Rank.o, points: 4, colonies: [{}] } };
export type Tile = keyof typeof RawTiles;
export const Tiles: {
  [key: string]: { rank: Rank; points: number; colonies: {}[] };
} = RawTiles;

const RawSciences = {
  neutron_bombs: { track: Track.pink, cost: 2, floor: 2 },
};
export type Science = keyof typeof RawSciences;
export const Sciences: {
  [key: string]: { track: Track; cost: number; floor: number };
} = RawSciences;

const RawEnemies = {
  death_star: {
    easy: {
      missiles: [],
      cannons: [1, 1, 1, 1],
      hull: 7,
      computer: 2,
    },
  },
};

export type Enemy = keyof typeof RawEnemies;
export const Enemies: {
  [key: string]: {
    [difficulty: string]: {
      missiles: number[];
      cannons: number[];
      hull: number;
      computer: number;
    };
  };
} = RawEnemies;

const RawTokens = {
  monolith: {},
  orbital: {},
};
export type Token = keyof typeof RawTokens;
export const Tokens: { [key: string]: {} } = RawTokens;

const RawUpgrades = {
  plasma_cannon: {},
};
export type Upgrade = keyof typeof RawUpgrades;
export const Upgrades: { [key: string]: {} } = RawUpgrades;
