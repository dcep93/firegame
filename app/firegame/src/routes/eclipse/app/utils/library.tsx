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
    portals: [0, 1, 2, 3, 4, 5],
    points: 4,
    colonies: [{ resource: Resource.gold }],
    npcs: [Ship.dreadnought],
  },
  "201": {
    rank: Rank.special,
    portals: [0, 1],
    points: 4,
    colonies: [{ resource: Resource.gold }],
    npcs: [Ship.cruiser],
  },
  "202": {
    rank: Rank.special,
    portals: [0, 1],
    points: 4,
    colonies: [{ resource: Resource.gold }],
    npcs: [Ship.cruiser],
  },
  "203": {
    rank: Rank.special,
    portals: [0, 1],
    points: 4,
    colonies: [{ resource: Resource.gold }],
    npcs: [Ship.cruiser],
  },
  "204": {
    rank: Rank.special,
    portals: [0, 1],
    points: 4,
    colonies: [{ resource: Resource.gold }],
    npcs: [Ship.cruiser],
  },
  "205": {
    rank: Rank.special,
    portals: [0, 1],
    points: 4,
    colonies: [{ resource: Resource.gold }],
    npcs: [Ship.cruiser],
  },
  "206": {
    rank: Rank.special,
    portals: [0, 1],
    points: 4,
    colonies: [{ resource: Resource.gold }],
    npcs: [Ship.cruiser],
  },
  blue: {
    rank: Rank.special,
    portals: [0, 1],
    points: 3,
    colonies: [{ resource: Resource.gold }],
  },
  green: {
    rank: Rank.special,
    portals: [0, 1],
    points: 3,
    colonies: [{ resource: Resource.gold }],
  },
  red: {
    rank: Rank.special,
    portals: [0, 1],
    points: 3,
    colonies: [{ resource: Resource.gold }],
  },
  yellow: {
    rank: Rank.special,
    portals: [0, 1],
    points: 3,
    colonies: [{ resource: Resource.gold }],
  },
  black: {
    rank: Rank.special,
    portals: [0, 1],
    points: 3,
    colonies: [{ resource: Resource.gold }],
  },
  white: {
    rank: Rank.special,
    portals: [0, 1],
    points: 3,
    colonies: [{ resource: Resource.gold }],
  },
};
export type Tile = keyof typeof RawTiles;
export const Tiles: {
  [key: string]: {
    rank: Rank;
    portals: number[];
    points: number;
    colonies: { resource: Resource; advanced?: boolean }[];
    npcs?: Ship[];
    diamond?: boolean;
    warp_portal?: boolean;
  };
} = RawTiles;

const RawSciences = {
  neutron_bombs: { track: Track.pink, cost: 2, floor: 2 },
  wormhole_generator: { track: Track.yellow, cost: 14, floor: 7 },
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
  warp_portal: {},
};
export type Token = keyof typeof RawTokens;
export const Tokens: { [key: string]: {} } = RawTokens;

const RawUpgrades = {
  plasma_cannon: {},
};
export type Upgrade = keyof typeof RawUpgrades;
export const Upgrades: { [key: string]: {} } = RawUpgrades;
