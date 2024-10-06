import { Rank, Resource, Resources, Ship, Track } from "./gameTypes";

export const disc_cost_arr = [0, 0, 1, 2, 3, 5, 7, 10, 13, 17, 21, 25, 30];
export const income_arr = [2, 3, 4, 6, 8, 10, 12, 15, 18, 21, 24, 28];

const RawFactions = {
  red: {
    color: "#F42948",
    tile: "222" as Tile,
    tileData: {
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
    storage: {
      [Resource.materials]: 4,
      [Resource.science]: 2,
      [Resource.gold]: 26,
    },
    research: ["plasma_cannon", "gauss_shield", "fusion_drive"] as Science[],
    ships: {
      [Ship.interceptor]: {
        builtIn: { initiative: 2, energy: 1 },
        upgrades: [
          "ion_cannon",
          "nuclear_source",
          "nuclear_drive",
          "_empty",
        ] as Upgrade[],
      },
      [Ship.cruiser]: {
        builtIn: { initiative: 1, energy: 1 },
        upgrades: [
          "ion_cannon",
          "hull",
          "nuclear_drive",
          "electron_computer",
          "nuclear_source",
          "_empty",
        ] as Upgrade[],
      },
      [Ship.dreadnought]: {
        builtIn: { energy: 1 },
        upgrades: [
          "ion_cannon",
          "ion_cannon",
          "hull",
          "hull",
          "electron_computer",
          "nuclear_source",
          "nuclear_drive",
          "_empty",
        ] as Upgrade[],
      },
      [Ship.starbase]: {
        builtIn: { initiative: 4, energy: 3 },
        upgrades: [
          "electron_computer",
          "ion_cannon",
          "hull",
          "hull",
          "_empty",
        ] as Upgrade[],
      },
    },
  },
  blue: {
    color: "lightblue",
    tile: "224" as Tile,
    tileData: {
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
    storage: {
      [Resource.materials]: 2,
      [Resource.science]: 6,
      [Resource.gold]: 2,
    },
    research: ["advanced_labs" as Science],
    ships: {
      [Ship.interceptor]: {
        builtIn: { initiative: 2 },
        upgrades: [
          "ion_cannon",
          "nuclear_source",
          "nuclear_drive",
          "_empty",
        ] as Upgrade[],
      },
      [Ship.cruiser]: {
        builtIn: { initiative: 1 },
        upgrades: [
          "ion_cannon",
          "hull",
          "electron_computer",
          "nuclear_source",
          "nuclear_drive",
          "_empty",
        ] as Upgrade[],
      },
      [Ship.dreadnought]: {
        builtIn: {},
        upgrades: [
          "electron_computer",
          "ion_cannon",
          "ion_cannon",
          "hull",
          "hull",
          "nuclear_source",
          "nuclear_drive",
          "_empty",
        ] as Upgrade[],
      },
      [Ship.starbase]: {
        builtIn: { initiative: 4, energy: 3 },
        upgrades: [
          "electron_computer",
          "hull",
          "hull",
          "ion_cannon",
          "_empty",
        ] as Upgrade[],
      },
    },
  },
  green: {
    color: "lightgreen",
    tile: "226" as Tile,
    tileData: {
      rank: Rank.special,
      portals: [0, 1, 3, 4],
      points: 3,
      artifact: true,
      colonies: [
        { resource: Resource.materials },
        { resource: Resource.science },
      ],
    },
    storage: {
      [Resource.materials]: 4,
      [Resource.science]: 3,
      [Resource.gold]: 2,
    },
    research: ["starbase" as Science],
    ships: {
      [Ship.interceptor]: {
        builtIn: { computer: 1, energy: 2 },
        upgrades: [
          "ion_cannon",
          "nuclear_source",
          "nuclear_drive",
        ] as Upgrade[],
      },
      [Ship.cruiser]: {
        builtIn: { computer: 1, energy: 2 },
        upgrades: [
          "nuclear_source",
          "ion_cannon",
          "hull",
          "nuclear_drive",
          "_empty",
        ] as Upgrade[],
      },
      [Ship.dreadnought]: {
        builtIn: { computer: 1, energy: 2 },
        upgrades: [
          "ion_cannon",
          "ion_cannon",
          "hull",
          "hull",
          "nuclear_source",
          "nuclear_drive",
          "_empty",
        ] as Upgrade[],
      },
      [Ship.starbase]: {
        builtIn: { initiative: 2, energy: 5, computer: 1 },
        upgrades: [
          "electron_computer",
          "ion_cannon",
          "hull",
          "hull",
        ] as Upgrade[],
      },
    },
  },
  yellow: {
    color: "yellow",
    tile: "228" as Tile,
    tileData: {
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
    storage: {
      [Resource.materials]: 3,
      [Resource.science]: 4,
      [Resource.gold]: 2,
    },
    research: ["fusion_drive" as Science],
    ships: {
      [Ship.interceptor]: {
        builtIn: { initiative: 2 },
        upgrades: [
          "ion_cannon",
          "nuclear_source",
          "nuclear_drive",
          "_empty",
        ] as Upgrade[],
      },
      [Ship.cruiser]: {
        builtIn: { initiative: 1 },
        upgrades: [
          "ion_cannon",
          "electron_computer",
          "nuclear_source",
          "hull",
          "nuclear_drive",
          "_empty",
        ] as Upgrade[],
      },
      [Ship.dreadnought]: {
        builtIn: {},
        upgrades: [
          "ion_cannon",
          "ion_cannon",
          "hull",
          "hull",
          "electron_computer",
          "nuclear_source",
          "nuclear_drive",
          "_empty",
        ] as Upgrade[],
      },
      [Ship.starbase]: {
        builtIn: { initiative: 4, energy: 3 },
        upgrades: [
          "electron_computer",
          "ion_cannon",
          "hull",
          "hull",
          "_empty",
        ] as Upgrade[],
      },
    },
  },
  pinknwhite: {
    color: "#E88FE8",
    tile: "230" as Tile,
    tileData: {
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
    storage: {
      [Resource.materials]: 4,
      [Resource.science]: 3,
      [Resource.gold]: 3,
    },
    research: ["positron_computer" as Science],
    ships: {
      [Ship.interceptor]: {
        builtIn: { initiative: 2 },
        upgrades: [
          "ion_cannon",
          "nuclear_source",
          "nuclear_drive",
          "_empty",
        ] as Upgrade[],
      },
      [Ship.cruiser]: {
        builtIn: { initiative: 1 },
        upgrades: [
          "ion_cannon",
          "hull",
          "electron_computer",
          "nuclear_source",
          "nuclear_drive",
          "_empty",
        ] as Upgrade[],
      },
      [Ship.dreadnought]: {
        builtIn: {},
        upgrades: [
          "ion_cannon",
          "ion_cannon",
          "hull",
          "hull",
          "electron_computer",
          "nuclear_source",
          "nuclear_drive",
          "_empty",
        ] as Upgrade[],
      },
      [Ship.starbase]: {
        builtIn: { initiative: 4, energy: 3 },
        upgrades: [
          "electron_computer",
          "hull",
          "hull",
          "_empty",
          "ion_cannon",
        ] as Upgrade[],
      },
    },
  },
  black: {
    color: "orange",
    tile: "232" as Tile,
    tileData: {
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
    storage: {
      [Resource.materials]: 4,
      [Resource.science]: 3,
      [Resource.gold]: 3,
    },
    research: ["gauss_shield", "neutron_bombs"] as Science[],
    ships: {
      [Ship.interceptor]: {
        builtIn: { initiative: 3, energy: 1 },
        upgrades: [
          "ion_cannon",
          "gauss_shield",
          "nuclear_source",
          "nuclear_drive",
        ] as Upgrade[],
      },
      [Ship.cruiser]: {
        builtIn: { initiative: 2, energy: 2 },
        upgrades: [
          "ion_cannon",
          "electron_computer",
          "nuclear_source",
          "hull",
          "gauss_shield",
          "nuclear_drive",
        ] as Upgrade[],
      },
      [Ship.dreadnought]: {
        builtIn: { energy: 3, initiative: 1 },
        upgrades: [
          "ion_cannon",
          "ion_cannon",
          "electron_computer",
          "nuclear_source",
          "hull",
          "hull",
          "nuclear_drive",
          "gauss_shield",
        ] as Upgrade[],
      },
      [Ship.starbase]: {
        builtIn: { initiative: 5, energy: 3 },
        upgrades: [
          "electron_computer",
          "hull",
          "ion_cannon",
          "gauss_shield",
          "hull",
        ] as Upgrade[],
      },
    },
  },
};
export type Faction = keyof typeof RawFactions;
export type ShipData = {
  [ship in Ship]: { builtIn?: UpgradeData; upgrades: Upgrade[] };
};
export const Factions: {
  [key: string]: {
    color: string;
    tile: Tile;
    tileData: TileData;
    storage: Resources;
    research: Science[];
    ships: ShipData;
  };
} = RawFactions;

const RawDiamonds = {
  monolith: { count: 1, special: true },
  warp_portal: { count: 1, special: true },
  ion_turret: { count: 1, upgrade: { dice: [1, 1] } },
  ion_disruptor: { count: 1, upgrade: { dice: [1], initiative: 3 } },
  ion_missile: { count: 1, upgrade: { missile: [1, 1, 1] } },
  plasma_turret: { count: 1, upgrade: { dice: [2, 2], energy: -3 } },
  soliton_charger: { count: 1, upgrade: { dice: [3], energy: -1 } },
  soliton_missile: { count: 1, upgrade: { missile: [3], initiative: 1 } },
  antimatter_missile: { count: 1, upgrade: { missile: [4] } },
  shard_hull: { count: 1, upgrade: { hull: 3 } },
  axion_computer: { count: 1, upgrade: { computer: 2, initiative: 1 } },
  flux_shield: { count: 1, upgrade: { shield: 3, initiative: 1, energy: -2 } },
  inversion_shield: { count: 1, upgrade: { shield: 2, energy: 2 } },
  muon_source: {
    count: 1,
    builtInUpgrade: true,
    upgrade: { initiative: 1, energy: 2 },
  },
  nonlinear_drive: { count: 1, upgrade: { drive: 2, energy: 2 } },
  conformal_drive: {
    count: 1,
    upgrade: { drive: 4, initiative: 2, energy: -2 },
  },
  hypergrid_source: { count: 1, upgrade: { energy: 11 } },
  orbital: { count: 2, special: true, resources: { [Resource.materials]: 2 } },
  resources: {
    count: 2,
    resources: {
      [Resource.materials]: 2,
      [Resource.science]: 2,
      [Resource.gold]: 3,
    },
  },
  materials: { count: 3, resources: { [Resource.materials]: 6 } },
  science: { count: 3, resources: { [Resource.science]: 5 } },
  gold: { count: 3, resources: { [Resource.gold]: 8 } },
  research: { count: 3, special: true },
  cruiser: { count: 3, special: true },
};
export type Diamond = keyof typeof RawDiamonds;
export const Diamonds: {
  [key: string]: {
    count: number;
    builtInUpgrade?: boolean;
    upgrade?: UpgradeData;
    resources?: {
      [r in Resource]?: number;
    };
    special?: boolean;
  };
} = RawDiamonds;

const RawTiles = {
  "100": {
    rank: Rank.special,
    portals: [0, 1, 2, 3, 4, 5],
    points: 4,
    enemies: [Ship.dreadnought],
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
  "271": {
    rank: Rank.special,
    portals: [0, 1, 3, 4],
    points: 2,
    enemies: [Ship.cruiser],
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
    enemies: [Ship.cruiser],
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
    enemies: [Ship.cruiser],
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
    enemies: [Ship.cruiser],
    artifact: true,
    colonies: [
      { resource: Resource.gold },
      { resource: Resource.science },
      { resource: Resource.science, advanced: true },
    ],
  },
  "101": {
    rank: Rank.i,
    portals: [1, 2, 3, 4, 5],
    points: 2,
    enemies: [Ship.interceptor],
    colonies: [
      { resource: Resource.gold },
      { resource: Resource.materials },
      { resource: Resource.materials, advanced: true },
    ],
  },
  "102": {
    rank: Rank.i,
    portals: [0, 2, 3, 5],
    points: 2,
    colonies: [{ resource: Resource.science }, { resource: Resource.science }],
  },
  "103": {
    rank: Rank.i,
    portals: [0, 1, 2, 4, 5],
    points: 2,
    colonies: [{ resource: Resource.gold }, { resource: Resource.science }],
  },
  "104": {
    rank: Rank.i,
    portals: [0, 1, 3, 4],
    points: 2,
    enemies: [Ship.interceptor, Ship.interceptor],
    colonies: [
      { resource: Resource.gold },
      { resource: Resource.science },
      { resource: Resource.gold, advanced: true },
      { resource: Resource.science, advanced: true },
    ],
  },
  "105": {
    rank: Rank.i,
    portals: [0, 1, 3, 4, 5],
    points: 2,
    enemies: [Ship.interceptor],
    colonies: [
      { resource: Resource.gold },
      { resource: Resource.science },
      { resource: Resource.materials, advanced: true },
    ],
  },
  "106": {
    rank: Rank.i,
    portals: [0, 1, 2, 3],
    points: 2,
    colonies: [{ resource: Resource.gold }, { resource: Resource.materials }],
  },
  "107": {
    rank: Rank.i,
    portals: [0, 1, 2, 3, 5],
    points: 3,
    artifact: true,
    colonies: [
      { resource: Resource.gold },
      { resource: Resource.materials, advanced: true },
      { resource: Resource.science, advanced: true },
    ],
  },
  "108": {
    rank: Rank.i,
    portals: [0, 1, 3, 4],
    points: 2,
    enemies: [Ship.interceptor],
    colonies: [
      {},
      { resource: Resource.science },
      { resource: Resource.gold, advanced: true },
    ],
  },
  "109": {
    rank: Rank.i,
    portals: [1, 2, 3, 4, 5],
    points: 4,
    artifact: true,
    enemies: [Ship.interceptor, Ship.interceptor],
    colonies: [{ resource: Resource.gold }, { resource: Resource.materials }],
  },
  "110": {
    rank: Rank.i,
    portals: [0, 2, 3, 4],
    points: 2,
    diamond: true,
    colonies: [{ resource: Resource.gold, advanced: true }, { advanced: true }],
  },
  "201": {
    rank: Rank.ii,
    portals: [1, 3, 5],
    points: 1,
    colonies: [{ resource: Resource.gold }, { resource: Resource.materials }],
  },
  "202": {
    rank: Rank.ii,
    portals: [1, 3, 5],
    points: 2,
    artifact: true,
    colonies: [
      { resource: Resource.science },
      { resource: Resource.science, advanced: true },
    ],
  },
  "203": {
    rank: Rank.ii,
    portals: [0, 1, 3, 5],
    points: 2,
    enemies: [Ship.interceptor, Ship.interceptor],
    colonies: [
      { resource: Resource.gold, advanced: true },
      { resource: Resource.materials },
      { resource: Resource.science },
    ],
  },
  "204": {
    rank: Rank.ii,
    portals: [0, 1, 3, 5],
    artifact: true,
    points: 2,
    enemies: [Ship.interceptor],
    colonies: [
      {},
      { resource: Resource.materials, advanced: true },
      { resource: Resource.gold, advanced: true },
    ],
  },
  "205": {
    rank: Rank.ii,
    portals: [2, 3, 4],
    points: 1,
    artifact: true,
    colonies: [
      { resource: Resource.gold },
      { resource: Resource.gold, advanced: true },
      { resource: Resource.science, advanced: true },
    ],
  },
  "206": {
    rank: Rank.ii,
    portals: [1, 2, 3, 5],
    points: 1,
    diamond: true,
    colonies: [{ resource: Resource.materials }],
  },
  "207": {
    rank: Rank.ii,
    portals: [0, 1, 3],
    points: 2,
    diamond: true,
    colonies: [],
  },
  "208": {
    rank: Rank.ii,
    portals: [0, 2, 3, 5],
    points: 2,
    diamond: true,
    colonies: [],
  },
  "209": {
    rank: Rank.ii,
    portals: [0, 1, 3, 5],
    points: 1,
    colonies: [{ resource: Resource.gold }, { resource: Resource.science }],
  },
  "210": {
    rank: Rank.ii,
    portals: [0, 3, 5],
    points: 1,
    colonies: [{ resource: Resource.gold }, { resource: Resource.materials }],
  },
  "211": {
    rank: Rank.ii,
    portals: [0, 1, 2, 3],
    points: 1,
    enemies: [Ship.interceptor],
    colonies: [
      {},
      { resource: Resource.gold },
      { resource: Resource.materials, advanced: true },
    ],
  },
  "214": {
    rank: Rank.ii,
    portals: [0, 1, 2, 4, 5],
    points: 2,
    enemies: [Ship.interceptor],
    colonies: [
      { advanced: true },
      { resource: Resource.science },
      { resource: Resource.materials, advanced: true },
    ],
  },
  "281": {
    rank: Rank.ii,
    portals: [0, 2, 3, 5],
    points: 2,
    warp_portal: true,
    diamond: true,
    colonies: [{ resource: Resource.gold }, { resource: Resource.science }],
  },
  "301": {
    rank: Rank.iii,
    portals: [0, 2, 3],
    points: 2,
    artifact: true,
    enemies: [Ship.interceptor, Ship.interceptor],
    colonies: [
      { resource: Resource.gold },
      { resource: Resource.science },
      { resource: Resource.materials, advanced: true },
    ],
  },
  "302": {
    rank: Rank.iii,
    portals: [0, 3, 4],
    points: 2,
    artifact: true,
    enemies: [Ship.interceptor],
    colonies: [
      { resource: Resource.materials },
      { resource: Resource.gold, advanced: true },
      { resource: Resource.science, advanced: true },
    ],
  },
  "303": {
    rank: Rank.iii,
    portals: [3, 5],
    points: 2,
    artifact: true,
    enemies: [Ship.interceptor],
    colonies: [
      {},
      { resource: Resource.science, advanced: true },
      { resource: Resource.gold, advanced: true },
    ],
  },
  "304": {
    rank: Rank.iii,
    portals: [0, 3],
    points: 2,
    colonies: [
      { resource: Resource.gold, advanced: true },
      { resource: Resource.materials },
    ],
  },
  "305": {
    rank: Rank.iii,
    portals: [0, 1, 3],
    points: 1,
    enemies: [Ship.interceptor],
    colonies: [
      { resource: Resource.materials },
      { resource: Resource.science },
    ],
  },
  "306": {
    rank: Rank.iii,
    portals: [1, 3],
    points: 1,
    colonies: [{ resource: Resource.gold }, { resource: Resource.materials }],
  },
  "307": {
    rank: Rank.iii,
    portals: [0, 2, 3],
    points: 2,
    colonies: [
      { resource: Resource.gold },
      { resource: Resource.science, advanced: true },
    ],
  },
  "308": {
    rank: Rank.iii,
    portals: [2, 3, 5],
    points: 2,
    colonies: [
      { resource: Resource.science },
      { resource: Resource.materials, advanced: true },
    ],
  },
  "309": {
    rank: Rank.iii,
    portals: [0, 3, 5],
    points: 2,
    colonies: [
      { resource: Resource.gold },
      { resource: Resource.science, advanced: true },
    ],
  },
  "310": {
    rank: Rank.iii,
    portals: [0, 3],
    points: 1,
    colonies: [
      { resource: Resource.materials },
      { resource: Resource.science },
    ],
  },
  "311": {
    rank: Rank.iii,
    portals: [0, 2, 3],
    points: 1,
    diamond: true,
    colonies: [{ resource: Resource.materials }],
  },
  "312": {
    rank: Rank.iii,
    portals: [0, 1, 3],
    points: 1,
    diamond: true,
    colonies: [{ resource: Resource.materials }],
  },
  "313": {
    rank: Rank.iii,
    portals: [0, 3],
    points: 1,
    diamond: true,
    colonies: [{}],
  },
  "314": {
    rank: Rank.iii,
    portals: [2, 3, 4],
    points: 1,
    diamond: true,
    colonies: [{}],
  },
  "315": {
    rank: Rank.iii,
    portals: [0, 3, 5],
    points: 1,
    diamond: true,
    colonies: [],
  },
  "316": {
    rank: Rank.iii,
    portals: [0, 1, 3],
    points: 1,
    diamond: true,
    colonies: [],
  },
  "317": {
    rank: Rank.iii,
    portals: [3, 4],
    points: 2,
    colonies: [
      { resource: Resource.gold },
      { resource: Resource.gold, advanced: true },
    ],
  },
  "318": {
    rank: Rank.iii,
    portals: [2, 3],
    points: 1,
    colonies: [{}, { resource: Resource.materials, advanced: true }],
  },
  "381": {
    rank: Rank.iii,
    portals: [0, 3, 4],
    points: 1,
    diamond: true,
    warp_portal: true,
    colonies: [{ resource: Resource.gold }, { resource: Resource.materials }],
  },
  "382": {
    rank: Rank.iii,
    portals: [0, 2, 3],
    points: 1,
    diamond: true,
    warp_portal: true,
    colonies: [
      { resource: Resource.materials },
      { resource: Resource.science },
    ],
  },
};
export type Tile = keyof typeof RawTiles;
export type TileData = {
  rank: Rank;
  portals: number[];
  points: number;
  colonies: { resource?: Resource; advanced?: boolean }[];
  enemies?: Ship[];
  diamond?: boolean;
  artifact?: boolean;
  warp_portal?: boolean;
};
export const Tiles: {
  [key: string]: TileData;
} = Object.fromEntries(
  (Object.entries(RawTiles) as [Tile, TileData][]).concat(
    Object.values(Factions).map((faction) => [faction.tile, faction.tileData])
  )
);

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
  [key: string]: {
    track: Track;
    cost: number;
    floor: number;
    count: number;
    upgrade?: UpgradeData;
  };
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

export enum Token {
  monolith,
  orbital,
  warp_portal,
}

const RawUpgrades = {
  hull: { hull: 1 },
  nuclear_drive: { drive: 1, initiative: 1, energy: -1 },
  nuclear_source: { energy: 3 },
  electron_computer: { computer: 1 },
  ion_cannon: { dice: [1], energy: -1 },
  _empty: {},
};
export type Upgrade = keyof typeof RawUpgrades;
export type UpgradeData = {
  energy?: number;
  hull?: number;
  shield?: number;
  drive?: number;
  initiative?: number;
  computer?: number;
  missile?: number[];
  dice?: number[];
};
export const Upgrades: {
  [key: string]: UpgradeData;
} = Object.fromEntries(
  (Object.entries(RawUpgrades) as [Upgrade, UpgradeData][])
    .concat(
      Object.entries(Diamonds)
        .map(([diamond, diamondData]) => ({ diamond, diamondData }))
        .filter(({ diamondData }) => diamondData.upgrade)
        .map(({ diamond, diamondData }) => [diamond, diamondData.upgrade]) as [
        Upgrade,
        UpgradeData
      ][]
    )
    .concat(
      Object.entries(Sciences)
        .map(([science, scienceData]) => ({
          science,
          ...scienceData,
        }))
        .filter(({ upgrade }) => upgrade)
        .map((obj) => [obj.science, obj.upgrade]) as [Upgrade, UpgradeData][]
    )
);
