import {
  AnimalResourcesType,
  CaveTileType,
  PlayerType,
  ResourcesType,
  Task,
} from "./NewGame";
import utils from "./utils";

export enum Cavern {
  starting_dwelling,
  dwelling,
  simple_dwelling__4_2,
  simple_dwelling__3_3,
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
  title: string;
  points?: number;
  pointsF?: (p: PlayerType) => number;
  onPurchase?: (p: PlayerType) => void;
  action?: (p: PlayerType) => void;
  animalRoom?: (r: AnimalResourcesType, p: PlayerType) => boolean;
  supply?: ResourcesType;
};

const Caverns: { [t in Cavern]: CavernType } = {
  [Cavern.starting_dwelling]: {
    cost: {},
    category: CavernCategory.dwelling,
    title: "room for 2 dwarves and 1 pair of animals",
    animalRoom: (r: AnimalResourcesType, p: PlayerType) =>
      Object.keys(r).length === 1 && Object.values(r)[0] <= 2,
    points: 0,
  },
  [Cavern.dwelling]: {
    cost: { wood: 4, stone: 3 },
    category: CavernCategory.dwelling,
    title: "room for 1 dwarf",
    points: 3,
  },
  [Cavern.simple_dwelling__4_2]: {
    cost: { wood: 4, stone: 2 },
    category: CavernCategory.dwelling,
    title: "room for 1 dwarf",
    points: 0,
  },
  [Cavern.simple_dwelling__3_3]: {
    cost: { wood: 3, stone: 3 },
    category: CavernCategory.dwelling,
    title: "room for 1 dwarf",
    points: 0,
  },
  [Cavern.mixed_dwelling]: {
    cost: { wood: 5, stone: 4 },
    category: CavernCategory.dwelling,
    title: "room for 1 dwarf and 1 pair of animals",
    points: 4,
    animalRoom: (r: AnimalResourcesType, p: PlayerType) =>
      Object.keys(r).length === 1 && Object.values(r)[0] <= 2,
  },
  [Cavern.couple_dwelling]: {
    cost: { wood: 8, stone: 6 },
    category: CavernCategory.dwelling,
    title: "room for 2 dwarves",
    points: 5,
  },
  [Cavern.additional_dwelling]: {
    cost: { wood: 4, stone: 3 },
    category: CavernCategory.dwelling,
    title: "room for the 6th dwarf only",
    points: 5,
  },
  [Cavern.cuddle_room]: {
    cost: { wood: 1 },
    category: CavernCategory.green,
    title: "room for as many [sheep] as you have dwarves",
    points: 2,
    animalRoom: (r: AnimalResourcesType, p: PlayerType) =>
      Object.keys(r).length === 1 &&
      r.sheep !== undefined &&
      r.sheep <= (p.availableDwarves || []).concat(p.usedDwarves || []).length,
  },
  [Cavern.breakfast_room]: {
    cost: { wood: 1 },
    category: CavernCategory.green,
    title: "room for up to 3 [cows]",
    points: 0,
    animalRoom: (r: AnimalResourcesType, p: PlayerType) =>
      Object.keys(r).length === 1 && r.cows !== undefined && r.cows <= 3,
  },
  [Cavern.stubble_room]: {
    cost: { wood: 1, ore: 1 },
    category: CavernCategory.green,
    title: "you may keep 1 farm animal on each empty field",
    points: 1,
  },
  [Cavern.work_room]: {
    cost: { stone: 1 },
    category: CavernCategory.green,
    title: "you may furnish tunnels",
    points: 2,
  },
  [Cavern.guest_room]: {
    cost: { wood: 1, stone: 1 },
    category: CavernCategory.green,
    title: "either/or becomes and/or",
    points: 0,
  },
  [Cavern.office_room]: {
    cost: { stone: 1 },
    category: CavernCategory.green,
    title: "TODO twin tiles may overhang\nevery time you do score 2 [gold]",
    points: 0,
  },
  [Cavern.carpenter]: {
    cost: { stone: 1 },
    category: CavernCategory.green,
    title:
      "every time you furnish a cavern or build fences,\nyou receive a discount of 1 [wood]",
    points: 0,
  },
  [Cavern.stone_carver]: {
    cost: { wood: 1 },
    category: CavernCategory.green,
    title:
      "immediately 2 [stone]\n\nevery time you furnish a cavern or build a stable,\nyou receive a discount of 1 [stone]",
    points: 1,
    onPurchase: (p: PlayerType) => utils.addResourcesToPlayer(p, { stone: 2 }),
  },
  [Cavern.blacksmith]: {
    cost: { wood: 1, stone: 2 },
    category: CavernCategory.green,
    title:
      "immediately 2 [ore]\n\nevery time you forge a weapon,\nyou receive a discount of 2 [ore]",
    points: 3,
    onPurchase: (p: PlayerType) => utils.addResourcesToPlayer(p, { ore: 2 }),
  },
  [Cavern.miner]: {
    cost: { wood: 1, stone: 1 },
    category: CavernCategory.green,
    title:
      "at the beginning of each round\n1 [ore] per [donkey] in an ore mine",
    points: 3,
  },
  [Cavern.builder]: {
    cost: { stone: 1 },
    category: CavernCategory.green,
    title:
      "you may replace 1 [wood] with 1 [ore] and/or 1 [stone] when paying for a furnishing tile",
    points: 3,
  },
  [Cavern.trader]: {
    cost: { wood: 1 },
    category: CavernCategory.green,
    title: "convert: 2 [gold] -> [wood] + [ore] + [stone]",
    points: 2,
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, { gold: -2, wood: 1, ore: 1, stone: 1 }),
  },
  [Cavern.wood_supplier]: {
    cost: { stone: 1 },
    category: CavernCategory.green,
    title: "at the beginning of the next 7 rounds\n1 [wood]",
    points: 2,
    supply: { wood: 7 },
  },
  [Cavern.stone_supplier]: {
    cost: { wood: 1 },
    category: CavernCategory.green,
    title: "at the beginning of the next 5 rounds\n1 [stone]",
    points: 1,
    supply: { stone: 5 },
  },
  [Cavern.ruby_supplier]: {
    cost: { wood: 2, stone: 2 },
    category: CavernCategory.green,
    title: "at the beginning of the next 4 rounds\n1 [ruby]",
    points: 2,
    supply: { rubies: 4 },
  },
  [Cavern.dog_school]: {
    cost: {},
    category: CavernCategory.green,
    title: "for each new [dog]\n1 [wood]",
    points: 0,
  },
  [Cavern.quarry]: {
    cost: { wood: 1 },
    category: CavernCategory.green,
    title: "for each newborn [donkey]\n1 [stone]",
    points: 2,
  },
  [Cavern.seam]: {
    cost: { wood: 2 },
    category: CavernCategory.green,
    title: "for each new [stone]\n1 [ore]",
    points: 1,
  },
  [Cavern.slaughtering_cave]: {
    cost: { wood: 2, stone: 2 },
    category: CavernCategory.green,
    title: "for each farm animal you convert into [food]\n1 [food]",
    points: 2,
  },
  [Cavern.cooking_cave]: {
    cost: { stone: 2 },
    category: CavernCategory.green,
    title: "convert: [grain] + [vegetable] -> 5 [food]",
    points: 2,
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, { grain: -1, vegetables: -1, food: 5 }),
  },
  [Cavern.working_cave]: {
    cost: { wood: 1, stone: 1 },
    category: CavernCategory.green,
    title: "you may feed exactly 1 dwarf with\n[wood]/[stone]/2 [ore]",
    points: 2,
  },
  [Cavern.mining_cave]: {
    cost: { wood: 3, stone: 2 },
    category: CavernCategory.green,
    title: "reduces feeding costs by\n1 [food] per [donkey] in a mine",
    points: 2,
  },
  [Cavern.breeding_cave]: {
    cost: { grain: 1, stone: 1 },
    category: CavernCategory.green,
    title: "for 1/2/3/4 newborn animals\n1/2/3/5 [food]",
    points: 2,
  },
  [Cavern.peaceful_cave]: {
    cost: { wood: 2, stone: 2 },
    category: CavernCategory.green,
    title:
      "you may trade your weapons\nfor food at a 1:1 ratio\naccording to their strength",
    points: 2,
    action: (p: PlayerType) => {
      utils.isMyTurn() &&
        Promise.resolve()
          .then(() => utils.queueTasks([{ t: Task.peaceful_cave }]))
          .then(() => utils.prepareNextTask("activated peaceful_cave"));
    },
  },
  [Cavern.weaving_parlor]: {
    cost: { wood: 2, stone: 1 },
    category: CavernCategory.yellow,
    title: "immediately 1 [food] per [sheep]\n1 point per 2 [sheep]",
    pointsF: (p: PlayerType) =>
      Math.floor((utils.getAllResources(p).sheep || 0) / 2),
    onPurchase: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, {
        food: utils.getAllResources(p).sheep || 0,
      }),
  },
  [Cavern.milking_parlor]: {
    cost: { wood: 2, stone: 2 },
    category: CavernCategory.yellow,
    title: "immediately 1 [food] per [cow]\n1 point per [cow]",
    pointsF: (p: PlayerType) => utils.getAllResources(p).cows || 0,
    onPurchase: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, {
        food: utils.getAllResources(p).cows || 0,
      }),
  },
  [Cavern.state_parlor]: {
    cost: { gold: 5, stone: 3 },
    category: CavernCategory.yellow,
    title:
      "immediately 2 [food] per adjacent dwelling\n4 points per adjacent dwelling",
    pointsF: (p: PlayerType) => 4 * numAdjacentToStateParlor(p),
    onPurchase: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, {
        food: 2 * numAdjacentToStateParlor(p),
      }),
  },
  [Cavern.hunting_parlor]: {
    cost: { wood: 2 },
    category: CavernCategory.yellow,
    title: "convert: 2 [boar] -> 2 [gold] + 2 [food]",
    points: 1,
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, { boars: -2, gold: 2, food: 2 }),
  },
  [Cavern.beer_parlor]: {
    cost: { wood: 2 },
    category: CavernCategory.yellow,
    title: "convert: 2 [grain] -> 3 [points] OR 4 [food]",
    points: 3,
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, { grain: -2 }) &&
      utils.queueTasks([{ t: Task.beer_parlor }]),
  },
  [Cavern.blacksmithing_parlor]: {
    cost: { ore: 3 },
    category: CavernCategory.yellow,
    title: "convert: [ore] + [ruby] -> 2 [gold] + [food]",
    points: 2,
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, { ore: -1, rubies: -1, gold: 2, food: 1 }),
  },
  [Cavern.stone_storage]: {
    cost: { wood: 3, ore: 1 },
    category: CavernCategory.yellow,
    title: "1 point per [stone]",
    pointsF: (p: PlayerType) => p.resources?.stone || 0,
  },
  [Cavern.ore_storage]: {
    cost: { wood: 1, stone: 2 },
    category: CavernCategory.yellow,
    title: "1 point per 2 [ore]",
    pointsF: (p: PlayerType) => Math.floor((p.resources?.ore || 0) / 2),
  },
  [Cavern.spare_part_storage]: {
    cost: { wood: 2 },
    category: CavernCategory.yellow,
    title: "convert: [wood] + [ore] + [stone] -> 2 [gold]",
    points: 0,
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, { wood: -1, stone: -1, ore: -1, gold: 2 }),
  },
  [Cavern.main_storage]: {
    cost: { wood: 2, stone: 1 },
    category: CavernCategory.yellow,
    title: "2 points per yellow cavern",
    pointsF: (p: PlayerType) =>
      2 *
      Object.keys(p.boughtTiles)
        .map((t) => Caverns[parseInt(t) as Cavern])
        .filter((t) => t.category === CavernCategory.yellow).length,
  },
  [Cavern.weapon_storage]: {
    cost: { wood: 3, stone: 2 },
    category: CavernCategory.yellow,
    title: "3 points per weapon",
    pointsF: (p: PlayerType) =>
      (p.availableDwarves || [])
        .concat(p.usedDwarves || [])
        .filter((d) => d > 0).length,
  },
  [Cavern.supplies_storage]: {
    cost: { wood: 1, food: 3 },
    category: CavernCategory.yellow,
    title: "8 points if all of your dwarves\nthat are in play\nhave a weapon",
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
    title: "5 points for 5 dwarves\n10 points for 6 dwarves",
    pointsF: (p: PlayerType) =>
      Math.max(
        0,
        5 * ((p.availableDwarves || []).concat(p.usedDwarves || []).length - 4)
      ),
  },
  [Cavern.treasure_chamber]: {
    cost: { wood: 1, stone: 1 },
    category: CavernCategory.yellow,
    title: "1 point per [ruby]",
    pointsF: (p: PlayerType) => p.resources?.rubies || 0,
  },
  [Cavern.food_chamber]: {
    cost: { wood: 2, vegetables: 2 },
    category: CavernCategory.yellow,
    title: "2 point per [grain] + [vegetable]",
    pointsF: (p: PlayerType) =>
      2 *
      Math.min(
        utils.getAllResources(p).grain || 0,
        utils.getAllResources(p).vegetables || 0
      ),
  },
  [Cavern.prayer_chamber]: {
    cost: { wood: 2 },
    category: CavernCategory.yellow,
    title:
      "8 points if none of your\ndwarves has a weapon\nwhen scoring this tile",
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
    title: "prevents up to 7 negative points",
    points: 0,
  },
  [Cavern.fodder_chamber]: {
    cost: { grain: 2, stone: 1 },
    category: CavernCategory.yellow,
    title: "1 point per 3 farm animals",
    pointsF: (p: PlayerType) =>
      Math.floor(
        Object.entries(utils.getAllResources(p))
          .map(([k, v]) => ({ k, v }))
          .filter(({ k }) =>
            (
              [
                "sheep",
                "donkeys",
                "boars",
                "cows",
              ] as (keyof AnimalResourcesType)[]
            ).includes(k as keyof AnimalResourcesType)
          )
          .map(({ v }) => v)
          .sum() / 3
      ),
  },
};

function numAdjacentToStateParlor(p: PlayerType): number {
  const coords = utils
    .getGrid(p)
    .find(({ t }) => (t as CaveTileType).tile === Cavern.state_parlor)!;
  return [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]
    .map(([i, j]) => (p.cave[coords.i + i] || {})[coords.j + j]?.tile)
    .filter(
      (t) => t !== undefined && Caverns[t]?.category === CavernCategory.dwelling
    ).length;
}

export default Caverns;
