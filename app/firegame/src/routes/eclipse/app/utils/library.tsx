import { Rank, Resource, Resources, Ship, Track } from "./gameTypes";

const RawFactions = {
  red: {
    tile: "222" as Tile,
    storage: {
      [Resource.materials]: 4,
      [Resource.science]: 2,
      [Resource.gold]: 26,
    },
    research: ["plasma_cannon", "gauss_shield", "fusion_drive"] as Science[],
    ships: {
      [Ship.interceptor]: [
        "red_interceptor",
        "ion_cannon",
        "nuclear_source",
        "nuclear_drive",
        "_empty",
      ] as Upgrade[],
      [Ship.cruiser]: [
        "red_cruiser",
        "ion_cannon",
        "hull",
        "nuclear_drive",
        "electron_computer",
        "nuclear_source",
        "_empty",
      ] as Upgrade[],
      [Ship.dreadnought]: [
        "red_dreadnought",
        "ion_cannon",
        "ion_cannon",
        "hull",
        "hull",
        "electron_computer",
        "nuclear_source",
        "nuclear_drive",
        "_empty",
      ] as Upgrade[],
      [Ship.starbase]: [
        "red_starbase",
        "electron_computer",
        "ion_cannon",
        "hull",
        "hull",
        "_empty",
      ] as Upgrade[],
    },
  },
  blue: {
    tile: "224" as Tile,
    storage: {
      [Resource.materials]: 2,
      [Resource.science]: 6,
      [Resource.gold]: 2,
    },
    research: ["advanced_labs" as Science],
    ships: {
      [Ship.interceptor]: [
        "blue_interceptor",
        "ion_cannon",
        "nuclear_source",
        "nuclear_drive",
        "_empty",
      ] as Upgrade[],
      [Ship.cruiser]: [
        "blue_cruiser",
        "ion_cannon",
        "hull",
        "electron_computer",
        "nuclear_source",
        "nuclear_drive",
        "_empty",
      ] as Upgrade[],
      [Ship.dreadnought]: [
        "blue_dreadnought",
        "electron_computer",
        "ion_cannon",
        "ion_cannon",
        "hull",
        "hull",
        "nuclear_source",
        "nuclear_drive",
        "_empty",
      ] as Upgrade[],
      [Ship.starbase]: [
        "blue_starbase",
        "electron_computer",
        "hull",
        "hull",
        "ion_cannon",
        "_empty",
      ] as Upgrade[],
    },
  },
  green: {
    tile: "226" as Tile,
    storage: {
      [Resource.materials]: 4,
      [Resource.science]: 3,
      [Resource.gold]: 2,
    },
    research: ["starbase" as Science],
    ships: {
      [Ship.interceptor]: [
        "green_interceptor",
        "ion_cannon",
        "nuclear_source",
        "nuclear_drive",
      ] as Upgrade[],
      [Ship.cruiser]: [
        "green_cruiser",
        "nuclear_source",
        "ion_cannon",
        "hull",
        "nuclear_drive",
        "_empty",
      ] as Upgrade[],
      [Ship.dreadnought]: [
        "green_dreadnought",
        "ion_cannon",
        "ion_cannon",
        "hull",
        "hull",
        "nuclear_source",
        "nuclear_drive",
        "_empty",
      ] as Upgrade[],
      [Ship.starbase]: [
        "green_starbase",
        "electron_computer",
        "ion_cannon",
        "hull",
        "hull",
      ] as Upgrade[],
    },
  },
  yellow: {
    tile: "228" as Tile,
    storage: {
      [Resource.materials]: 3,
      [Resource.science]: 4,
      [Resource.gold]: 2,
    },
    research: ["fusion_drive" as Science],
    ships: {
      [Ship.interceptor]: [
        "yellow_interceptor",
        "ion_cannon",
        "nuclear_source",
        "nuclear_drive",
        "_empty",
      ] as Upgrade[],
      [Ship.cruiser]: [
        "yellow_cruiser",
        "ion_cannon",
        "electron_computer",
        "nuclear_source",
        "hull",
        "nuclear_drive",
        "_empty",
      ] as Upgrade[],
      [Ship.dreadnought]: [
        "yellow_dreadnought",
        "ion_cannon",
        "ion_cannon",
        "hull",
        "hull",
        "electron_computer",
        "nuclear_source",
        "nuclear_drive",
        "_empty",
      ] as Upgrade[],
      [Ship.starbase]: [
        "yellow_starbase",
        "electron_computer",
        "ion_cannon",
        "hull",
        "hull",
        "_empty",
      ] as Upgrade[],
    },
  },
  white: {
    tile: "230" as Tile,
    storage: {
      [Resource.materials]: 4,
      [Resource.science]: 3,
      [Resource.gold]: 3,
    },
    research: ["positron_computer" as Science],
    ships: {
      [Ship.interceptor]: [
        "white_interceptor",
        "ion_cannon",
        "nuclear_source",
        "nuclear_drive",
        "_empty",
      ] as Upgrade[],
      [Ship.cruiser]: [
        "white_cruiser",
        "ion_cannon",
        "hull",
        "electron_computer",
        "nuclear_source",
        "nuclear_drive",
        "_empty",
      ] as Upgrade[],
      [Ship.dreadnought]: [
        "white_dreadnought",
        "ion_cannon",
        "ion_cannon",
        "hull",
        "hull",
        "electron_computer",
        "nuclear_source",
        "nuclear_drive",
        "_empty",
      ] as Upgrade[],
      [Ship.starbase]: [
        "white_starbase",
        "electron_computer",
        "hull",
        "hull",
        "_empty",
        "ion_cannon",
      ] as Upgrade[],
    },
  },
  black: {
    tile: "232" as Tile,
    storage: {
      [Resource.materials]: 4,
      [Resource.science]: 3,
      [Resource.gold]: 3,
    },
    research: ["gauss_shield", "neutron_bombs"] as Science[],
    ships: {
      [Ship.interceptor]: [
        "black_interceptor",
        "ion_cannon",
        "gauss_shield",
        "nuclear_source",
        "nuclear_drive",
      ] as Upgrade[],
      [Ship.cruiser]: [
        "black_cruiser",
        "ion_cannon",
        "electron_computer",
        "nuclear_source",
        "hull",
        "gauss_shield",
        "nuclear_drive",
      ] as Upgrade[],
      [Ship.dreadnought]: [
        "black_dreadnought",
        "ion_cannon",
        "ion_cannon",
        "electron_computer",
        "nuclear_source",
        "hull",
        "hull",
        "nuclear_drive",
        "gauss_shield",
      ] as Upgrade[],
      [Ship.starbase]: [
        "black_starbase",
        "electron_computer",
        "hull",
        "ion_cannon",
        "gauss_shield",
        "hull",
      ] as Upgrade[],
    },
  },
};
export type Faction = keyof typeof RawFactions;
export const Factions: {
  [key: string]: {
    tile: Tile;
    storage: Resources;
    research: Science[];
    ships: { [ship in Ship]: Upgrade[] };
  };
} = RawFactions;

const RawDiamonds = {
  monolith: 1,
  warp_portal: 1,
  ion_turret: 1, // {dice: [1,1]}
  ion_disruptor: 1, // {dice: [1], initiative: 3}
  ion_missile: 1, // {missile: [1,1,1]}
  plasma_turret: 1, // {dice: [2,2], energy: -3}
  soliton_charger: 1, // {dice: [3], energy: -1}
  soliton_missile: 1, // {missile: [3], initiative: 1}
  antimatter_missle: 1, // {missile: [4]}
  shard_hull: 1, // {hull: 3}
  axion_computer: 1, // {computer: 2, initiative: 1}
  flux_shield: 1, // {shield: 3, initiative: 1, energy: -2}
  inversion_shield: 1, // {shield: 2, energy: 2}
  muon_source: 1, // {initiative: 1, energy: 2} (outside)
  nonlinear_drive: 1, // {drive: 2, energy: 2}
  conformal_drive: 1, // {drive: 4, initiative: 2, energy: -2}
  hypergrid_source: 1, // {energy: 11}
  orbital: 2, // {materials: 2}
  resources: 2, // {materials: 2, science: 2, gold: 3}
  materials: 3, // {materials: 6}
  science: 3, // {science: 5}
  gold: 3, // {gold: 8}
  research: 3,
  cruiser: 3,
};
export type Diamond = keyof typeof RawDiamonds;
export const Diamonds: { [key: string]: number } = RawDiamonds;

const RawTiles = {
  "100": {
    rank: Rank.special,
    portals: [0, 1, 2, 3, 4, 5],
    points: 4,
    npcs: [Ship.dreadnought],
    artifact: true,
    colonies: [
      { resource: Resource.gold },
      { resource: Resource.gold },
      { resource: Resource.materials },
      { resource: Resource.materials, advanced: true },
      { resource: Resource.science },
      { resource: Resource.science, advanced: true },
    ],
  },
  "222": {
    // red
    rank: Rank.special,
    portals: [0, 1, 3, 4],
    points: 3,
    artifact: true,
    colonies: [
      { resource: Resource.gold },
      { resource: Resource.science },
      { resource: Resource.gold, advanced: true },
      { resource: Resource.science, advanced: true },
    ],
  },
  "224": {
    // blue
    rank: Rank.special,
    portals: [0, 1, 3, 4],
    points: 3,
    artifact: true,
    colonies: [
      { resource: Resource.gold },
      { resource: Resource.science, advanced: true },
      { resource: Resource.materials, advanced: true },
    ],
  },
  "226": {
    // green
    rank: Rank.special,
    portals: [0, 1, 3, 4],
    points: 3,
    artifact: true,
    colonies: [
      { resource: Resource.materials },
      { resource: Resource.science },
    ],
  },
  "228": {
    // yellow
    rank: Rank.special,
    portals: [0, 1, 3, 4],
    points: 3,
    artifact: true,
    colonies: [
      { resource: Resource.gold },
      { resource: Resource.science },
      { resource: Resource.materials, advanced: true },
    ],
  },
  "230": {
    // white
    rank: Rank.special,
    portals: [0, 1, 3, 4],
    points: 3,
    artifact: true,
    colonies: [
      { resource: Resource.gold },
      { resource: Resource.science },
      { resource: Resource.gold, advanced: true },
      { resource: Resource.materials, advanced: true },
    ],
  },
  "232": {
    // black
    rank: Rank.special,
    portals: [0, 1, 3, 4],
    points: 3,
    artifact: true,
    colonies: [
      { resource: Resource.materials },
      { resource: Resource.science },
      { resource: Resource.gold, advanced: true },
      { resource: Resource.materials, advanced: true },
    ],
  },
  "271": {
    rank: Rank.special,
    portals: [0, 1, 3, 4],
    points: 2,
    nps: [Ship.cruiser],
    artifact: true,
    colonies: [
      { resource: Resource.gold },
      { resource: Resource.science },
      { resource: Resource.materials, advanced: true },
    ],
  },
  "272": {
    rank: Rank.special,
    portals: [0, 1, 3, 4],
    points: 2,
    nps: [Ship.cruiser],
    artifact: true,
    colonies: [
      { resource: Resource.gold },
      { resource: Resource.materials },
      { resource: Resource.science, advanced: true },
    ],
  },
  "273": {
    rank: Rank.special,
    portals: [0, 1, 3, 4],
    points: 2,
    nps: [Ship.cruiser],
    artifact: true,
    colonies: [
      { resource: Resource.gold },
      { resource: Resource.materials },
      { resource: Resource.materials, advanced: true },
    ],
  },
  "274": {
    rank: Rank.special,
    portals: [0, 1, 3, 4],
    points: 2,
    nps: [Ship.cruiser],
    artifact: true,
    colonies: [
      { resource: Resource.gold },
      { resource: Resource.science },
      { resource: Resource.science, advanced: true },
    ],
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
  neutron_bombs: { track: Track.pink, cost: 2 },
  starbase: { track: Track.pink, cost: 4 },
  plasma_cannon: {
    track: Track.pink,
    cost: 6,
    upgrade: { dice: [2], energy: -2 },
  },
  phase_shield: {
    track: Track.pink,
    cost: 8,
    upgrade: { shield: 2, energy: -1 },
  },
  advanced_mining: { track: Track.pink, cost: 10 },
  tachyon_source: { track: Track.pink, cost: 12, upgrade: { energy: 9 } },
  gluon_computer: {
    track: Track.pink,
    cost: 14,
    upgrade: { computer: 3, energy: -2 },
  },
  plasma_missile: {
    track: Track.pink,
    cost: 16,
    upgrade: { missile: [2, 2], energy: -1 },
  },
  gauss_shield: {
    track: Track.green,
    cost: 2,
    upgrade: { shield: 1 },
  },
  fusion_source: { track: Track.green, cost: 4, upgrade: { energy: 6 } },
  improved_hull: { track: Track.green, cost: 6, upgrade: { hull: 2 } },
  positron_computer: {
    track: Track.green,
    cost: 8,
    upgrade: { computer: 2, energy: -1 },
  },
  advanced_economy: { track: Track.green, cost: 10 },
  tachyon_drive: {
    track: Track.green,
    cost: 12,
    upgrade: { drive: 3, energy: -3, initiative: 3 },
  },
  antimatter_cannon: {
    track: Track.green,
    cost: 14,
    upgrade: { dice: [4], energy: -4 },
  },
  quantum_grid: { track: Track.green, cost: 16 },
  nanorobots: { track: Track.yellow, cost: 2 },
  fusion_drive: {
    track: Track.yellow,
    cost: 4,
    upgrade: { drive: 2, energy: -2, initiative: 2 },
  },
  orbital: { track: Track.yellow, cost: 6 },
  advanced_robotics: { track: Track.yellow, cost: 8 },
  advanced_labs: { track: Track.yellow, cost: 10 },
  monolith: { track: Track.yellow, cost: 12 },
  wormhole_generator: { track: Track.yellow, cost: 14 },
  artifact_key: { track: Track.yellow, cost: 16 },
  antimatter_splitter: { track: Track.black, cost: 5 },
  neutron_absorber: { track: Track.black, cost: 5 },
  conifold_field: {
    track: Track.black,
    cost: 5,
    upgrade: { hull: 3, energy: -2 },
  },
  cloaking_device: { track: Track.black, cost: 7 },
  absorption_shield: {
    track: Track.black,
    cost: 7,
    upgrade: { shield: 1, energy: 4 },
  },
  sentient_hull: {
    track: Track.black,
    cost: 7,
    upgrade: { computer: 1, hull: 1 },
  },
  improved_logistics: { track: Track.black, cost: 7 },
  transition_drive: { track: Track.black, cost: 9, upgrade: { drive: 3 } },
  soliton_cannon: {
    track: Track.black,
    cost: 9,
    upgrade: { dice: [3], energy: -3 },
  },
  warp_portal: { track: Track.black, cost: 9 },
  pico_modulator: { track: Track.black, cost: 11 },
  flux_missile: {
    track: Track.black,
    cost: 11,
    upgrade: { missile: [1, 1], initiative: 1 },
  },
  ancient_labs: { track: Track.black, cost: 13 },
  zero_point_source: { track: Track.black, cost: 15, upgrade: { energy: 12 } },
  metasynthesis: { track: Track.black, cost: 17 },
};
export type Science = keyof typeof RawSciences;
export const Sciences: {
  [key: string]: { track: Track; cost: number; floor: number; count: number };
} = Object.fromEntries(
  Object.entries(RawSciences).map(([science, obj]) => [
    science,
    {
      floor: {
        2: 2,
        4: 3,
        6: 4,
        8: 5,
        10: 6,
        12: 6,
        14: 7,
        16: 8,
        5: 5,
        7: 6,
        9: 7,
        11: 8,
        13: 9,
        15: 10,
        17: 11,
      }[obj.cost]!,
      count: {
        2: 5,
        4: 5,
        6: 5,
        8: 5,
        10: 4,
        12: 3,
        14: 3,
        16: 3,
        5: 1,
        7: 1,
        9: 1,
        11: 1,
        13: 1,
        15: 1,
        17: 1,
      }[obj.cost]!,
      ...obj,
    },
  ])
);

const RawEnemies = {
  [Ship.interceptor]: {
    easy: {
      initiative: 2,
      cannons: [1, 1],
      missiles: [],
      hull: 1,
      computer: 1,
    },
    hard: {
      initiative: 1,
      cannons: [2],
      missiles: [],
      hull: 2,
      computer: 1,
    },
  },
  [Ship.cruiser]: {
    easy: {
      initiative: 3,
      cannons: [1, 1, 1],
      missiles: [],
      hull: 2,
      computer: 2,
    },
    medium: {
      initiative: 1,
      missiles: [2, 2],
      cannons: [4],
      hull: 3,
      computer: 1,
    },
  },
  [Ship.dreadnought]: {
    easy: {
      initiative: 0,
      missiles: [],
      cannons: [1, 1, 1, 1],
      hull: 7,
      computer: 2,
    },
    medium: {
      initiative: 2,
      missiles: [1, 1, 1, 1],
      cannons: [4],
      hull: 3,
      computer: 2,
    },
  },
};

export type Enemy = keyof typeof RawEnemies;
export const Enemies: {
  [key: string]: {
    [difficulty: string]: {
      missiles: number[];
      initiative: number;
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
  hull: { hull: 1 },
  nuclear_drive: { drive: 1, initiative: 1, energy: -1 },
  nuclear_source: { energy: 3 },
  electron_computer: { computer: 1 },
  ion_cannon: { dice: [1], energy: -1 },
  _empty: {},
  red_interceptor: { faction: true, initiative: 2, energy: 1 },
  red_cruiser: { faction: true, initiative: 1, energy: 1 },
  red_dreadnought: { faction: true, energy: 1 },
  red_starbase: { faction: true, initiative: 4, energy: 3 },
  blue_interceptor: { faction: true, initiative: 2 },
  blue_cruiser: { faction: true, initiative: 1 },
  blue_dreadnought: { faction: true },
  blue_starbase: { faction: true, initiative: 4, energy: 3 },
  green_interceptor: { faction: true, computer: 1, energy: 2 },
  green_cruiser: { faction: true, computer: 1, energy: 2 },
  green_dreadnought: { faction: true, computer: 1, energy: 2 },
  green_starbase: { faction: true, initiative: 2, energy: 5, computer: 1 },
  yellow_interceptor: { faction: true, initiative: 2 },
  yellow_cruiser: { faction: true, initiative: 1 },
  yellow_dreadnought: { faction: true },
  yellow_starbase: { faction: true, initiative: 4, energy: 3 },
  white_interceptor: { faction: true, initiative: 2 },
  white_cruiser: { faction: true, initiative: 1 },
  white_dreadnought: { faction: true },
  white_starbase: { faction: true, initiative: 4, energy: 3 },
  black_interceptor: { faction: true, initiative: 3, energy: 1 },
  black_cruiser: { faction: true, initiative: 2, energy: 2 },
  black_dreadnought: { faction: true, energy: 3, initiative: 1 },
  black_starbase: { faction: true, initiative: 5, energy: 3 },
};
export type Upgrade = keyof typeof RawUpgrades;
export const Upgrades: {
  [key: string]: {
    faction?: boolean;
    energy?: number;
    hull?: number;
    drive?: number;
    initiative?: number;
    computer?: number;
    missile?: number[];
    dice?: number[];
  };
} = RawUpgrades;
