import {
  AnimalResourcesType,
  PlayerType,
  ResourcesType,
  Task,
} from "./NewGame";
import utils, { store } from "./utils";

export enum Cavern {
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

export enum CavernCategory {
  dwelling,
  green,
  yellow,
}

export type CavernType = {
  cost: ResourcesType;
  category: CavernCategory;
  points?: number;
  pointsF?: (p: PlayerType) => number;
  onPurchase?: (p: PlayerType) => void;
  action?: (p: PlayerType) => void;
  animalRoom?: (r: AnimalResourcesType, p: PlayerType) => boolean;
  supply?: ResourcesType;
};

// TODO cavern_titles
const Caverns: { [t in Cavern]: CavernType } = {
  [Cavern.starting_dwelling]: {
    cost: {},
    category: CavernCategory.dwelling,
    points: 0,
  },
  [Cavern.dwelling]: {
    cost: { wood: 4, stone: 3 },
    category: CavernCategory.dwelling,
    points: 3,
  },
  [Cavern.simple_dwelling_4_2]: {
    cost: { wood: 4, stone: 2 },
    category: CavernCategory.dwelling,
    points: 0,
  },
  [Cavern.simple_dwelling_3_3]: {
    cost: { wood: 3, stone: 3 },
    category: CavernCategory.dwelling,
    points: 0,
  },
  [Cavern.mixed_dwelling]: {
    cost: { wood: 5, stone: 4 },
    category: CavernCategory.dwelling,
    points: 4,
    animalRoom: (r: AnimalResourcesType, p: PlayerType) =>
      Object.keys(r).length === 1 && Object.values(r)[0] <= 2,
  },
  [Cavern.couple_dwelling]: {
    cost: { wood: 8, stone: 6 },
    category: CavernCategory.dwelling,
    points: 5,
  },
  [Cavern.additional_dwelling]: {
    cost: { wood: 4, stone: 3 },
    category: CavernCategory.dwelling,
    points: 5,
  },
  [Cavern.cuddle_room]: {
    cost: { wood: 1 },
    category: CavernCategory.green,
    points: 2,
    animalRoom: (r: AnimalResourcesType, p: PlayerType) =>
      Object.keys(r).length === 1 &&
      r.sheep !== undefined &&
      r.sheep <= (p.availableDwarves || []).concat(p.usedDwarves || []).length,
  },
  [Cavern.breakfast_room]: {
    cost: { wood: 1 },
    category: CavernCategory.green,
    points: 0,
    animalRoom: (r: AnimalResourcesType, p: PlayerType) =>
      Object.keys(r).length === 1 && r.cows !== undefined && r.cows <= 3,
  },
  [Cavern.stubble_room]: {
    cost: { wood: 1, ore: 1 },
    category: CavernCategory.green,
    points: 1,
    // TODO you can keep 1 animal on each empty field
  },
  [Cavern.work_room]: {
    cost: { stone: 1 },
    category: CavernCategory.green,
    points: 2,
  },
  [Cavern.guest_room]: {
    cost: { wood: 1, stone: 1 },
    category: CavernCategory.green,
    points: 0,
    // TODO either/or becomes and/or
  },
  [Cavern.office_room]: {
    cost: { stone: 1 },
    category: CavernCategory.green,
    points: 0,
    // TODO overhang
  },
  [Cavern.carpenter]: {
    cost: { stone: 1 },
    category: CavernCategory.green,
    points: 0,
  },
  [Cavern.stone_carver]: {
    cost: { wood: 1 },
    category: CavernCategory.green,
    points: 1,
    onPurchase: (p: PlayerType) => utils.addResourcesToPlayer(p, { stone: 2 }),
  },
  [Cavern.blacksmith]: {
    cost: { wood: 1, stone: 2 },
    category: CavernCategory.green,
    points: 3,
    onPurchase: (p: PlayerType) => utils.addResourcesToPlayer(p, { ore: 2 }),
  },
  [Cavern.miner]: {
    cost: { wood: 1, stone: 1 },
    category: CavernCategory.green,
    points: 3,
  },
  [Cavern.builder]: {
    cost: { stone: 1 },
    category: CavernCategory.green,
    points: 3,
  },
  [Cavern.trader]: {
    cost: { wood: 1 },
    category: CavernCategory.green,
    points: 2,
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, { gold: -2, wood: 1, ore: 1, stone: 1 }),
  },
  [Cavern.wood_supplier]: {
    cost: { stone: 1 },
    category: CavernCategory.green,
    points: 2,
    supply: { wood: 7 },
  },
  [Cavern.stone_supplier]: {
    cost: { wood: 1 },
    category: CavernCategory.green,
    points: 1,
    supply: { stone: 5 },
  },
  [Cavern.ruby_supplier]: {
    cost: { wood: 2, stone: 2 },
    category: CavernCategory.green,
    points: 2,
    supply: { rubies: 4 },
  },
  [Cavern.dog_school]: {
    cost: {},
    category: CavernCategory.green,
    points: 0,
  },
  [Cavern.quarry]: {
    cost: { wood: 1 },
    category: CavernCategory.green,
    points: 2,
    // TODO one stone per newborn donkey
  },
  [Cavern.seam]: {
    cost: { wood: 2 },
    category: CavernCategory.green,
    points: 1,
  },
  [Cavern.slaughtering_cave]: {
    cost: { wood: 2, stone: 2 },
    category: CavernCategory.green,
    points: 2,
  },
  [Cavern.cooking_cave]: {
    cost: { stone: 2 },
    category: CavernCategory.green,
    points: 2,
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, { grain: -1, vegetables: -1, food: 5 }),
  },
  [Cavern.working_cave]: {
    cost: { wood: 1, stone: 1 },
    category: CavernCategory.green,
    points: 2,
  },
  [Cavern.mining_cave]: {
    cost: { wood: 3, stone: 2 },
    category: CavernCategory.green,
    points: 2,
  },
  [Cavern.breeding_cave]: {
    cost: { grain: 1, stone: 1 },
    category: CavernCategory.green,
    points: 2,
    // TODO 1/2/3/5 food per newborn animal
  },
  [Cavern.peaceful_cave]: {
    cost: { wood: 2, stone: 2 },
    category: CavernCategory.green,
    points: 2,
    action: (p: PlayerType) => {
      utils.isMyTurn() &&
        Promise.resolve()
          .then(() => utils.queueTasks([{ t: Task.peaceful_cave }]))
          .then(() => store.update("activated peaceful_cave"));
    },
  },
  [Cavern.weaving_parlor]: {
    cost: { wood: 2, stone: 1 },
    category: CavernCategory.yellow,
    pointsF: (p: PlayerType) => Math.floor((p.resources?.sheep || 0) / 2),
    onPurchase: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, { food: p.resources?.sheep || 0 }),
  },
  [Cavern.milking_parlor]: {
    cost: { wood: 2, stone: 2 },
    category: CavernCategory.yellow,
    pointsF: (p: PlayerType) => p.resources?.cows || 0,
    onPurchase: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, { food: p.resources?.cows || 0 }),
  },
  [Cavern.state_parlor]: {
    cost: { gold: 5, stone: 3 },
    category: CavernCategory.yellow,
    pointsF: (p: PlayerType) => 4 * utils.numAdjacentToStateParlor(p),
    onPurchase: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, {
        food: 2 * utils.numAdjacentToStateParlor(p),
      }),
  },
  [Cavern.hunting_parlor]: {
    cost: { wood: 2 },
    category: CavernCategory.yellow,
    points: 1,
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, { boars: -2, gold: 2, food: 2 }),
  },
  [Cavern.beer_parlor]: {
    cost: { wood: 2 },
    category: CavernCategory.yellow,
    points: 3,
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, { grain: -2 }) &&
      utils.queueTasks([{ t: Task.beer_parlor }]),
  },
  [Cavern.blacksmithing_parlor]: {
    cost: { ore: 3 },
    category: CavernCategory.yellow,
    points: 2,
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, { ore: -1, rubies: -1, gold: 2, food: 1 }),
  },
  [Cavern.stone_storage]: {
    cost: { wood: 3, ore: 1 },
    category: CavernCategory.yellow,
    pointsF: (p: PlayerType) => p.resources?.stone || 0,
  },
  [Cavern.ore_storage]: {
    cost: { wood: 1, stone: 2 },
    category: CavernCategory.yellow,
    pointsF: (p: PlayerType) => Math.floor((p.resources?.ore || 0) / 2),
  },
  [Cavern.spare_part_storage]: {
    cost: { wood: 2 },
    category: CavernCategory.yellow,
    points: 0,
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, { wood: -1, stone: -1, ore: -1, gold: 2 }),
  },
  [Cavern.main_storage]: {
    cost: { wood: 2, stone: 1 },
    category: CavernCategory.yellow,
    pointsF: (p: PlayerType) =>
      2 *
      Object.keys(p.boughtTiles)
        .map((t) => Caverns[parseInt(t) as Cavern])
        .filter((t) => t.category === CavernCategory.yellow).length,
  },
  [Cavern.weapon_storage]: {
    cost: { wood: 3, stone: 2 },
    category: CavernCategory.yellow,
    pointsF: (p: PlayerType) =>
      (p.availableDwarves || [])
        .concat(p.usedDwarves || [])
        .filter((d) => d > 0).length,
  },
  [Cavern.supplies_storage]: {
    cost: { wood: 1, food: 3 },
    category: CavernCategory.yellow,
    pointsF: (p: PlayerType) =>
      (p.availableDwarves || [])
        .concat(p.usedDwarves || [])
        .filter((d) => d <= 0).length === 0
        ? 8
        : 0,
  },
  [Cavern.broom_chamber]: {
    cost: { wood: 1 },
    category: CavernCategory.yellow,
    pointsF: (p: PlayerType) =>
      Math.max(
        0,
        5 * ((p.availableDwarves || []).concat(p.usedDwarves || []).length - 4)
      ),
  },
  [Cavern.treasure_chamber]: {
    cost: { wood: 1, stone: 1 },
    category: CavernCategory.yellow,
    pointsF: (p: PlayerType) => p.resources?.rubies || 0,
  },
  [Cavern.food_chamber]: {
    cost: { wood: 2, vegetables: 2 },
    category: CavernCategory.yellow,
    pointsF: (p: PlayerType) =>
      2 * Math.min(p.resources?.grain || 0, p.resources?.vegetables || 0),
  },
  [Cavern.prayer_chamber]: {
    cost: { wood: 2 },
    category: CavernCategory.yellow,
    pointsF: (p: PlayerType) =>
      (p.availableDwarves || [])
        .concat(p.usedDwarves || [])
        .filter((d) => d > 0).length === 0
        ? 8
        : 0,
  },
  [Cavern.writing_chamber]: {
    cost: { stone: 2 },
    category: CavernCategory.yellow,
    points: 0,
  },
  [Cavern.fodder_chamber]: {
    cost: { grain: 2, stone: 1 },
    category: CavernCategory.yellow,
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

export default Caverns;
