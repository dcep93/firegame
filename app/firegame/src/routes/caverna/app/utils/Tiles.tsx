import {
  AnimalResourcesType,
  PlayerType,
  ResourcesType,
  Task,
} from "./NewGame";
import utils, { store } from "./utils";

export enum Tile {
  starting_dwelling,
  dwelling,
  simple_dwelling_4_2,
  simple_dwelling_3_3,
  mixed_dwelling,
  couple_dwelling,
  additional_dwelling,
  cuddle_room,
  breakfast_room,
  stubble_room,
  work_room,
  guest_room,
  office_room,
  carpenter,
  stone_carver,
  blacksmith,
  miner,
  builder,
  trader,
  wood_supplier,
  stone_supplier,
  ruby_supplier,
  dog_school,
  quarry,
  seam,
  slaughtering_cave,
  cooking_cave,
  working_cave,
  mining_cave,
  breeding_cave,
  peaceful_cave,
  weaving_parlor,
  milking_parlor,
  state_parlor,
  hunting_parlor,
  beer_parlor,
  blacksmithing_parlor,
  stone_storage,
  ore_storage,
  spare_part_storage,
  main_storage,
  weapon_storage,
  supplies_storage,
  broom_chamber,
  treasure_chamber,
  food_chamber,
  prayer_chamber,
  writing_chamber,
  fodder_chamber,
}

export enum TileCategory {
  dwelling,
  green,
  yellow,
}

export type TileType = {
  cost: ResourcesType;
  category: TileCategory;
  points?: number;
  pointsF?: (p: PlayerType) => number;
  onPurchase?: (p: PlayerType) => void;
  action?: (p: PlayerType) => void;
  animalRoom?: (r: AnimalResourcesType, p: PlayerType) => boolean;
  supply?: ResourcesType;
};

const Tiles: { [t in Tile]: TileType } = {
  [Tile.starting_dwelling]: {
    cost: {},
    category: TileCategory.dwelling,
    points: 0,
  },
  [Tile.dwelling]: {
    cost: { wood: 4, stone: 3 },
    category: TileCategory.dwelling,
    points: 3,
  },
  [Tile.simple_dwelling_4_2]: {
    cost: { wood: 4, stone: 2 },
    category: TileCategory.dwelling,
    points: 0,
  },
  [Tile.simple_dwelling_3_3]: {
    cost: { wood: 3, stone: 3 },
    category: TileCategory.dwelling,
    points: 0,
  },
  [Tile.mixed_dwelling]: {
    cost: { wood: 5, stone: 4 },
    category: TileCategory.dwelling,
    points: 4,
    animalRoom: (r: AnimalResourcesType, p: PlayerType) =>
      Object.keys(r).length === 1 && Object.values(r)[0] <= 2,
  },
  [Tile.couple_dwelling]: {
    cost: { wood: 8, stone: 6 },
    category: TileCategory.dwelling,
    points: 5,
  },
  [Tile.additional_dwelling]: {
    cost: { wood: 4, stone: 3 },
    category: TileCategory.dwelling,
    points: 5,
  },
  [Tile.cuddle_room]: {
    cost: { wood: 1 },
    category: TileCategory.green,
    points: 2,
    animalRoom: (r: AnimalResourcesType, p: PlayerType) =>
      Object.keys(r).length === 1 &&
      r.sheep !== undefined &&
      r.sheep <= (p.availableDwarves || []).concat(p.usedDwarves || []).length,
  },
  [Tile.breakfast_room]: {
    cost: { wood: 1 },
    category: TileCategory.green,
    points: 0,
    animalRoom: (r: AnimalResourcesType, p: PlayerType) =>
      Object.keys(r).length === 1 && r.cows !== undefined && r.cows <= 3,
  },
  [Tile.stubble_room]: {
    cost: { wood: 1, ore: 1 },
    category: TileCategory.green,
    points: 1,
    // TODO you can keep 1 animal on each empty field
  },
  [Tile.work_room]: {
    cost: { stone: 1 },
    category: TileCategory.green,
    points: 2,
  },
  [Tile.guest_room]: {
    cost: { wood: 1, stone: 1 },
    category: TileCategory.green,
    points: 0,
    // TODO either/or becomes and/or
  },
  [Tile.office_room]: {
    cost: { stone: 1 },
    category: TileCategory.green,
    points: 0,
    // TODO overhang
  },
  [Tile.carpenter]: {
    cost: { stone: 1 },
    category: TileCategory.green,
    points: 0,
  },
  [Tile.stone_carver]: {
    cost: { wood: 1 },
    category: TileCategory.green,
    points: 1,
    onPurchase: (p: PlayerType) => utils.addResourcesToPlayer(p, { stone: 2 }),
  },
  [Tile.blacksmith]: {
    cost: { wood: 1, stone: 2 },
    category: TileCategory.green,
    points: 3,
    onPurchase: (p: PlayerType) => utils.addResourcesToPlayer(p, { ore: 2 }),
  },
  [Tile.miner]: {
    cost: { wood: 1, stone: 1 },
    category: TileCategory.green,
    points: 3,
  },
  [Tile.builder]: {
    cost: { stone: 1 },
    category: TileCategory.green,
    points: 3,
  },
  [Tile.trader]: {
    cost: { wood: 1 },
    category: TileCategory.green,
    points: 2,
    action: (p: PlayerType) =>
      utils.convert(p, { gold: -2, wood: 1, ore: 1, stone: 1 }),
  },
  [Tile.wood_supplier]: {
    cost: { stone: 1 },
    category: TileCategory.green,
    points: 2,
    supply: { wood: 7 },
  },
  [Tile.stone_supplier]: {
    cost: { wood: 1 },
    category: TileCategory.green,
    points: 1,
    supply: { stone: 5 },
  },
  [Tile.ruby_supplier]: {
    cost: { wood: 2, stone: 2 },
    category: TileCategory.green,
    points: 2,
    supply: { rubies: 4 },
  },
  [Tile.dog_school]: {
    cost: {},
    category: TileCategory.green,
    points: 0,
  },
  [Tile.quarry]: {
    cost: { wood: 1 },
    category: TileCategory.green,
    points: 2,
    // TODO one stone per newborn donkey
  },
  [Tile.seam]: {
    cost: { wood: 2 },
    category: TileCategory.green,
    points: 1,
  },
  [Tile.slaughtering_cave]: {
    cost: { wood: 2, stone: 2 },
    category: TileCategory.green,
    points: 2,
  },
  [Tile.cooking_cave]: {
    cost: { stone: 2 },
    category: TileCategory.green,
    points: 2,
    action: (p: PlayerType) =>
      utils.convert(p, { grain: -1, vegetables: -1, food: 5 }),
  },
  [Tile.working_cave]: {
    cost: { wood: 1, stone: 1 },
    category: TileCategory.green,
    points: 2,
  },
  [Tile.mining_cave]: {
    cost: { wood: 3, stone: 2 },
    category: TileCategory.green,
    points: 2,
  },
  [Tile.breeding_cave]: {
    cost: { grain: 1, stone: 1 },
    category: TileCategory.green,
    points: 2,
    // TODO 1/2/3/5 food per newborn animal
  },
  [Tile.peaceful_cave]: {
    cost: { wood: 2, stone: 2 },
    category: TileCategory.green,
    points: 2,
    action: (p: PlayerType) => {
      utils.isMyTurn() &&
        Promise.resolve()
          .then(() => utils.queueTasks([{ t: Task.peaceful_cave }]))
          .then(() => store.update("activated peaceful_cave"));
    },
  },
  [Tile.weaving_parlor]: {
    cost: { wood: 2, stone: 1 },
    category: TileCategory.yellow,
    pointsF: (p: PlayerType) => Math.floor((p.resources?.sheep || 0) / 2),
    onPurchase: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, { food: p.resources?.sheep || 0 }),
  },
  [Tile.milking_parlor]: {
    cost: { wood: 2, stone: 2 },
    category: TileCategory.yellow,
    pointsF: (p: PlayerType) => p.resources?.cows || 0,
    onPurchase: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, { food: p.resources?.cows || 0 }),
  },
  [Tile.state_parlor]: {
    cost: { gold: 5, stone: 3 },
    category: TileCategory.yellow,
    pointsF: (p: PlayerType) => 4 * utils.numAdjacentToStateParlor(p),
    onPurchase: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, {
        food: 2 * utils.numAdjacentToStateParlor(p),
      }),
  },
  [Tile.hunting_parlor]: {
    cost: { wood: 2 },
    category: TileCategory.yellow,
    points: 1,
    action: (p: PlayerType) =>
      utils.convert(p, { boars: -2, gold: 2, food: 2 }),
  },
  [Tile.beer_parlor]: {
    cost: { wood: 2 },
    category: TileCategory.yellow,
    points: 3,
    action: (p: PlayerType) =>
      utils.convert(p, { grain: -2 }) &&
      utils.queueTasks([{ t: Task.beer_parlor }]),
  },
  [Tile.blacksmithing_parlor]: {
    cost: { ore: 3 },
    category: TileCategory.yellow,
    points: 2,
    action: (p: PlayerType) =>
      utils.convert(p, { ore: -1, rubies: -1, gold: 2, food: 1 }),
  },
  [Tile.stone_storage]: {
    cost: { wood: 3, ore: 1 },
    category: TileCategory.yellow,
    pointsF: (p: PlayerType) => p.resources?.stone || 0,
  },
  [Tile.ore_storage]: {
    cost: { wood: 1, stone: 2 },
    category: TileCategory.yellow,
    pointsF: (p: PlayerType) => Math.floor((p.resources?.ore || 0) / 2),
  },
  [Tile.spare_part_storage]: {
    cost: { wood: 2 },
    category: TileCategory.yellow,
    points: 0,
    action: (p: PlayerType) =>
      utils.convert(p, { wood: -1, stone: -1, ore: -1, gold: 2 }),
  },
  [Tile.main_storage]: {
    cost: { wood: 2, stone: 1 },
    category: TileCategory.yellow,
    pointsF: (p: PlayerType) =>
      2 *
      Object.keys(p.boughtTiles)
        .map((t) => Tiles[parseInt(t) as Tile])
        .filter((t) => t.category === TileCategory.yellow).length,
  },
  [Tile.weapon_storage]: {
    cost: { wood: 3, stone: 2 },
    category: TileCategory.yellow,
    pointsF: (p: PlayerType) =>
      (p.availableDwarves || [])
        .concat(p.usedDwarves || [])
        .filter((d) => d > 0).length,
  },
  [Tile.supplies_storage]: {
    cost: { wood: 1, food: 3 },
    category: TileCategory.yellow,
    pointsF: (p: PlayerType) =>
      (p.availableDwarves || [])
        .concat(p.usedDwarves || [])
        .filter((d) => d <= 0).length === 0
        ? 8
        : 0,
  },
  [Tile.broom_chamber]: {
    cost: { wood: 1 },
    category: TileCategory.yellow,
    pointsF: (p: PlayerType) =>
      Math.max(
        0,
        5 * ((p.availableDwarves || []).concat(p.usedDwarves || []).length - 4)
      ),
  },
  [Tile.treasure_chamber]: {
    cost: { wood: 1, stone: 1 },
    category: TileCategory.yellow,
    pointsF: (p: PlayerType) => p.resources?.rubies || 0,
  },
  [Tile.food_chamber]: {
    cost: { wood: 2, vegetables: 2 },
    category: TileCategory.yellow,
    pointsF: (p: PlayerType) =>
      2 * Math.min(p.resources?.grain || 0, p.resources?.vegetables || 0),
  },
  [Tile.prayer_chamber]: {
    cost: { wood: 2 },
    category: TileCategory.yellow,
    pointsF: (p: PlayerType) =>
      (p.availableDwarves || [])
        .concat(p.usedDwarves || [])
        .filter((d) => d > 0).length === 0
        ? 8
        : 0,
  },
  [Tile.writing_chamber]: {
    cost: { stone: 2 },
    category: TileCategory.yellow,
    points: 0,
  },
  [Tile.fodder_chamber]: {
    cost: { grain: 2, stone: 1 },
    category: TileCategory.yellow,
    pointsF: (p: PlayerType) =>
      Math.floor(
        ((p.resources?.sheep || 0) +
          (p.resources?.donkeys || 0) +
          (p.resources?.boars || 0) +
          (p.resources?.cows || 0)) /
          3
      ),
  },
};

export default Tiles;
