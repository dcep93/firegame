// types/enums

export enum Faction {
  blue,
  green,
  white,
  black,
  red,
  yellow,
}

export enum Resource {
  materials,
  science,
  gold,
}

export type Resources = {
  [r in Resource]: number;
};

export type Sector = {
  tile: Tile;
  orientation: number;
  enemies?: Enemy[];
  tokens?: Token[];
};

export enum Track {
  pink,
  green,
  yellow,
  black,
}

export enum Rank {
  o,
  i,
  ii,
  iii,
}

// library

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
