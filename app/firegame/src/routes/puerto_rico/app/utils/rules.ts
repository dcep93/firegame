export const PLAYER_COUNTS = [3, 4, 5] as const;
export type PlayerCount = (typeof PLAYER_COUNTS)[number];

export const GOOD_IDS = ["corn", "indigo", "sugar", "tobacco", "coffee"] as const;
export type GoodId = (typeof GOOD_IDS)[number];

export const PLANTATION_IDS = [...GOOD_IDS, "quarry"] as const;
export type PlantationId = (typeof PLANTATION_IDS)[number];

export const ROLE_IDS = [
  "settler",
  "mayor",
  "builder",
  "craftsman",
  "trader",
  "captain",
  "prospector_1",
  "prospector_2",
] as const;
export type RoleId = (typeof ROLE_IDS)[number];

export type RoleKind =
  | "settler"
  | "mayor"
  | "builder"
  | "craftsman"
  | "trader"
  | "captain"
  | "prospector";

export const ROLE_KIND: Record<RoleId, RoleKind> = {
  settler: "settler",
  mayor: "mayor",
  builder: "builder",
  craftsman: "craftsman",
  trader: "trader",
  captain: "captain",
  prospector_1: "prospector",
  prospector_2: "prospector",
};

export type BuildingKind = "production" | "violet" | "large";

export const BUILDING_IDS = [
  "small_indigo_plant",
  "small_sugar_mill",
  "indigo_plant",
  "sugar_mill",
  "tobacco_storage",
  "coffee_roaster",
  "small_market",
  "hacienda",
  "construction_hut",
  "small_warehouse",
  "hospice",
  "office",
  "large_market",
  "large_warehouse",
  "factory",
  "university",
  "harbor",
  "wharf",
  "guild_hall",
  "residence",
  "fortress",
  "customs_house",
  "city_hall",
] as const;
export type BuildingId = (typeof BUILDING_IDS)[number];

export const BUILDING_COLUMNS: readonly (readonly BuildingId[])[] = [
  [
    "small_indigo_plant",
    "small_sugar_mill",
    "small_market",
    "hacienda",
    "construction_hut",
    "small_warehouse",
  ],
  [
    "indigo_plant",
    "sugar_mill",
    "hospice",
    "office",
    "large_market",
    "large_warehouse",
  ],
  [
    "tobacco_storage",
    "coffee_roaster",
    "factory",
    "university",
    "harbor",
    "wharf",
  ],
  ["guild_hall", "residence", "fortress", "customs_house", "city_hall"],
];

export const BUILDING_QUARRY_CAP = Object.fromEntries(
  BUILDING_COLUMNS.flatMap((buildingIds, index) =>
    buildingIds.map((buildingId) => [buildingId, index + 1])
  )
) as Record<BuildingId, number>;

export type BuildingRule = {
  id: BuildingId;
  cost: number;
  victoryPoints: number;
  size: 1 | 2;
  kind: BuildingKind;
  supply: number;
  good?: GoodId;
  capacity?: number;
};

export const BUILDINGS: Record<BuildingId, BuildingRule> = {
  small_indigo_plant: {
    id: "small_indigo_plant",
    cost: 1,
    victoryPoints: 1,
    size: 1,
    kind: "production",
    supply: 4,
    good: "indigo",
    capacity: 1,
  },
  small_sugar_mill: {
    id: "small_sugar_mill",
    cost: 2,
    victoryPoints: 1,
    size: 1,
    kind: "production",
    supply: 4,
    good: "sugar",
    capacity: 1,
  },
  indigo_plant: {
    id: "indigo_plant",
    cost: 3,
    victoryPoints: 2,
    size: 1,
    kind: "production",
    supply: 3,
    good: "indigo",
    capacity: 3,
  },
  sugar_mill: {
    id: "sugar_mill",
    cost: 4,
    victoryPoints: 2,
    size: 1,
    kind: "production",
    supply: 3,
    good: "sugar",
    capacity: 3,
  },
  tobacco_storage: {
    id: "tobacco_storage",
    cost: 5,
    victoryPoints: 3,
    size: 1,
    kind: "production",
    supply: 3,
    good: "tobacco",
    capacity: 3,
  },
  coffee_roaster: {
    id: "coffee_roaster",
    cost: 6,
    victoryPoints: 3,
    size: 1,
    kind: "production",
    supply: 3,
    good: "coffee",
    capacity: 2,
  },
  small_market: { id: "small_market", cost: 1, victoryPoints: 1, size: 1, kind: "violet", supply: 2 },
  hacienda: { id: "hacienda", cost: 2, victoryPoints: 1, size: 1, kind: "violet", supply: 2 },
  construction_hut: { id: "construction_hut", cost: 2, victoryPoints: 1, size: 1, kind: "violet", supply: 2 },
  small_warehouse: { id: "small_warehouse", cost: 3, victoryPoints: 1, size: 1, kind: "violet", supply: 2 },
  hospice: { id: "hospice", cost: 4, victoryPoints: 2, size: 1, kind: "violet", supply: 2 },
  office: { id: "office", cost: 5, victoryPoints: 2, size: 1, kind: "violet", supply: 2 },
  large_market: { id: "large_market", cost: 5, victoryPoints: 2, size: 1, kind: "violet", supply: 2 },
  large_warehouse: { id: "large_warehouse", cost: 6, victoryPoints: 2, size: 1, kind: "violet", supply: 2 },
  factory: { id: "factory", cost: 8, victoryPoints: 3, size: 1, kind: "violet", supply: 2 },
  university: { id: "university", cost: 7, victoryPoints: 3, size: 1, kind: "violet", supply: 2 },
  harbor: { id: "harbor", cost: 8, victoryPoints: 3, size: 1, kind: "violet", supply: 2 },
  wharf: { id: "wharf", cost: 9, victoryPoints: 3, size: 1, kind: "violet", supply: 2 },
  guild_hall: { id: "guild_hall", cost: 10, victoryPoints: 4, size: 2, kind: "large", supply: 1 },
  residence: { id: "residence", cost: 10, victoryPoints: 4, size: 2, kind: "large", supply: 1 },
  fortress: { id: "fortress", cost: 10, victoryPoints: 4, size: 2, kind: "large", supply: 1 },
  customs_house: { id: "customs_house", cost: 10, victoryPoints: 4, size: 2, kind: "large", supply: 1 },
  city_hall: { id: "city_hall", cost: 10, victoryPoints: 4, size: 2, kind: "large", supply: 1 },
};

export const GOODS_SUPPLY: Record<GoodId, number> = {
  corn: 10,
  indigo: 11,
  sugar: 11,
  tobacco: 9,
  coffee: 9,
};

export const TRADER_PRICES: Record<GoodId, number> = {
  corn: 0,
  indigo: 1,
  sugar: 2,
  tobacco: 3,
  coffee: 4,
};

export const PLANTATION_COUNTS: Record<GoodId, number> = {
  corn: 10,
  indigo: 12,
  sugar: 11,
  tobacco: 9,
  coffee: 8,
};

export const SETUP: Record<
  PlayerCount,
  {
    startingDoubloons: number;
    victoryPoints: number;
    colonists: number;
    shipSizes: number[];
    roles: RoleId[];
    startingPlantations: GoodId[];
  }
> = {
  3: {
    startingDoubloons: 2,
    victoryPoints: 75,
    colonists: 55,
    shipSizes: [4, 5, 6],
    roles: ["settler", "mayor", "builder", "craftsman", "trader", "captain"],
    startingPlantations: ["indigo", "indigo", "corn"],
  },
  4: {
    startingDoubloons: 3,
    victoryPoints: 100,
    colonists: 75,
    shipSizes: [5, 6, 7],
    roles: ["settler", "mayor", "builder", "craftsman", "trader", "captain", "prospector_1"],
    startingPlantations: ["indigo", "indigo", "corn", "corn"],
  },
  5: {
    startingDoubloons: 4,
    victoryPoints: 122,
    colonists: 95,
    shipSizes: [6, 7, 8],
    roles: [
      "settler",
      "mayor",
      "builder",
      "craftsman",
      "trader",
      "captain",
      "prospector_1",
      "prospector_2",
    ],
    startingPlantations: ["indigo", "indigo", "indigo", "corn", "corn"],
  },
};

export const MAX_ISLAND_SPACES = 12;
export const MAX_CITY_SPACES = 12;
export const QUARRY_COUNT = 8;
export const TRADING_HOUSE_SIZE = 4;

export function emptyGoods(): Record<GoodId, number> {
  return { corn: 0, indigo: 0, sugar: 0, tobacco: 0, coffee: 0 };
}

export function playerCount(value: number): PlayerCount {
  if (value === 3 || value === 4 || value === 5) return value;
  throw new Error("Puerto Rico needs 3 to 5 players");
}
