import { Rank, Resource, Resources, Ship, Track } from "./gameTypes";

const RawFactions = {
  blue: {
    storage: {
      [Resource.materials]: 0,
      [Resource.science]: 0,
      [Resource.gold]: 0,
    },
    research: [],
    ships: {
      [Ship.interceptor]: [],
      [Ship.cruiser]: [],
      [Ship.dreadnought]: [],
      [Ship.starbase]: [],
    },
  },
  green: {
    storage: {
      [Resource.materials]: 0,
      [Resource.science]: 0,
      [Resource.gold]: 0,
    },
    research: [],
    ships: {
      [Ship.interceptor]: [],
      [Ship.cruiser]: [],
      [Ship.dreadnought]: [],
      [Ship.starbase]: [],
    },
  },
  white: {
    storage: {
      [Resource.materials]: 0,
      [Resource.science]: 0,
      [Resource.gold]: 0,
    },
    research: [],
    ships: {
      [Ship.interceptor]: [],
      [Ship.cruiser]: [],
      [Ship.dreadnought]: [],
      [Ship.starbase]: [],
    },
  },
  black: {
    storage: {
      [Resource.materials]: 0,
      [Resource.science]: 0,
      [Resource.gold]: 0,
    },
    research: [],
    ships: {
      [Ship.interceptor]: [],
      [Ship.cruiser]: [],
      [Ship.dreadnought]: [],
      [Ship.starbase]: [],
    },
  },
  red: {
    storage: {
      [Resource.materials]: 0,
      [Resource.science]: 0,
      [Resource.gold]: 0,
    },
    research: [],
    ships: {
      [Ship.interceptor]: [],
      [Ship.cruiser]: [],
      [Ship.dreadnought]: [],
      [Ship.starbase]: [],
    },
  },
  yellow: {
    storage: {
      [Resource.materials]: 0,
      [Resource.science]: 0,
      [Resource.gold]: 0,
    },
    research: [],
    ships: {
      [Ship.interceptor]: [],
      [Ship.cruiser]: [],
      [Ship.dreadnought]: [],
      [Ship.starbase]: [],
    },
  },
};
export type Faction = keyof typeof RawFactions;
export const Factions: {
  [key: string]: {
    storage: Resources;
    research: Science[];
    ships: { [ship in Ship]: Upgrade[] };
  };
} = RawFactions;

const RawDiamonds = {
  monolith: {},
  _8_gold: {},
};
export type Diamond = keyof typeof RawDiamonds;
export const Diamonds: { [key: string]: {} } = RawDiamonds;

const RawTiles = {
  "100": {
    rank: Rank.special,
    points: 4,
    colonies: [{}],
    enemies: ["death_star"] as Enemy[],
  },
  "201": {
    rank: Rank.special,
    points: 4,
    colonies: [{}],
    enemies: ["guardian"] as Enemy[],
  },
  "202": {
    rank: Rank.special,
    points: 4,
    colonies: [{}],
    enemies: ["guardian"] as Enemy[],
  },
  "203": {
    rank: Rank.special,
    points: 4,
    colonies: [{}],
    enemies: ["guardian"] as Enemy[],
  },
  "204": {
    rank: Rank.special,
    points: 4,
    colonies: [{}],
    enemies: ["guardian"] as Enemy[],
  },
  "205": {
    rank: Rank.special,
    points: 4,
    colonies: [{}],
    enemies: ["guardian"] as Enemy[],
  },
  "206": {
    rank: Rank.special,
    points: 4,
    colonies: [{}],
    enemies: ["guardian"] as Enemy[],
  },
};
export type Tile = keyof typeof RawTiles;
export const Tiles: {
  [key: string]: {
    rank: Rank;
    points: number;
    colonies: {}[];
    enemies?: Enemy[];
  };
} = RawTiles;

const RawSciences = {
  neutron_bombs: { track: Track.pink, cost: 2, floor: 2 },
};
export type Science = keyof typeof RawSciences;
export const Sciences: {
  [key: string]: { track: Track; cost: number; floor: number };
} = RawSciences;

const RawEnemies = {
  ancient: {
    easy: {
      missiles: [],
      cannons: [1, 1, 1, 1],
      hull: 7,
      computer: 2,
    },
  },
  guardian: {
    easy: {
      missiles: [],
      cannons: [1, 1, 1, 1],
      hull: 7,
      computer: 2,
    },
  },
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
