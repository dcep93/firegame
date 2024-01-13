import { PlayerType, ResourcesType } from "./NewGame";
import utils from "./utils";

export enum Tile {
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

export type TileType = {
  points?: number;
  pointsF?: (p: PlayerType) => number;
  cost: ResourcesType;
  dwelling?: number;
  onPurchase?: (p: PlayerType) => void;
  onClick?: (p: PlayerType) => void;
};

const Tiles: { [t in Tile]: TileType } = {
  [Tile.dwelling]: {
    points: 3,
    cost: { wood: 4, stone: 3 },
    dwelling: 1,
  },
  [Tile.simple_dwelling_4_2]: {
    points: 0,
    cost: { wood: 4, stone: 2 },
    dwelling: 1,
  },
  [Tile.simple_dwelling_3_3]: {
    points: 0,
    cost: { wood: 3, stone: 3 },
    dwelling: 1,
  },
  [Tile.mixed_dwelling]: {
    points: 4,
    cost: { wood: 5, stone: 4 },
    dwelling: 1,
    // TODO
  },
  [Tile.couple_dwelling]: {
    points: 5,
    cost: { wood: 8, stone: 6 },
    dwelling: 2,
  },
  [Tile.additional_dwelling]: {
    points: 5,
    cost: { wood: 4, stone: 3 },
    // TODO
  },
  [Tile.cuddle_room]: {
    points: 2,
    cost: { wood: 1 },
    // TODO
  },
  [Tile.breakfast_room]: {
    points: 0,
    cost: { wood: 1 },
    // TODO
  },
  [Tile.stubble_room]: {
    points: 1,
    cost: { wood: 1, ore: 1 },
    // TODO
  },
  [Tile.work_room]: {
    points: 2,
    cost: { stone: 1 },
    // TODO
  },
  [Tile.guest_room]: {
    points: 0,
    cost: { wood: 1, stone: 1 },
    // TODO
  },
  [Tile.office_room]: {
    points: 0,
    cost: { stone: 1 },
    // TODO
  },
  [Tile.carpenter]: {
    points: 0,
    cost: { stone: 1 },
    // TODO
  },
  [Tile.stone_carver]: {
    points: 1,
    cost: { wood: 1 },
    // TODO
  },
  [Tile.blacksmith]: {
    points: 3,
    cost: { wood: 1, stone: 2 },
    // TODO
  },
  [Tile.miner]: {
    points: 3,
    cost: { wood: 1, stone: 1 },
    // TODO
  },
  [Tile.builder]: {
    points: 3,
    cost: { stone: 1 },
    // TODO
  },
  [Tile.trader]: {
    points: 2,
    cost: { wood: 1 },
    // TODO
  },
  [Tile.wood_supplier]: {
    points: 2,
    cost: { stone: 1 },
    // TODO
  },
  [Tile.stone_supplier]: {
    points: 1,
    cost: { wood: 1 },
    // TODO
  },
  [Tile.ruby_supplier]: {
    points: 2,
    cost: { wood: 2, stone: 2 },
    // TODO
  },
  [Tile.dog_school]: {
    points: 0,
    cost: {},
    // TODO
  },
  [Tile.quarry]: {
    points: 2,
    cost: { wood: 1 },
    // TODO
  },
  [Tile.seam]: {
    points: 1,
    cost: { wood: 2 },
    // TODO
  },
  [Tile.slaughtering_cave]: {
    points: 2,
    cost: { wood: 2, stone: 2 },
    // TODO
  },
  [Tile.cooking_cave]: {
    points: 2,
    cost: { stone: 2 },
    // TODO
  },
  [Tile.working_cave]: {
    points: 2,
    cost: { wood: 1, stone: 1 },
    // TODO
  },
  [Tile.mining_cave]: {
    points: 2,
    cost: { wood: 3, stone: 2 },
    // TODO
  },
  [Tile.breeding_cave]: {
    points: 2,
    cost: { grain: 1, stone: 1 },
    // TODO
  },
  [Tile.peaceful_cave]: {
    points: 2,
    cost: { wood: 2, stone: 2 },
    // TODO
  },
  [Tile.weaving_parlor]: {
    pointsF: (p: PlayerType) => Math.floor((p.resources?.sheep || 0) / 2),
    cost: { wood: 2, stone: 1 },
    onPurchase: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, { food: p.resources?.sheep || 0 }),
  },
  [Tile.milking_parlor]: {
    pointsF: (p: PlayerType) => p.resources?.cows || 0,
    cost: { wood: 2, stone: 2 },
    onPurchase: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, { food: p.resources?.cows || 0 }),
  },
  [Tile.state_parlor]: {
    cost: { gold: 5, stone: 3 },
    // TODO
  },
  [Tile.hunting_parlor]: {
    points: 1,
    cost: { wood: 2 },
    // TODO
  },
  [Tile.beer_parlor]: {
    points: 3,
    cost: { wood: 2 },
    // TODO
  },
  [Tile.blacksmithing_parlor]: {
    points: 2,
    cost: { ore: 3 },
    // TODO
  },
  [Tile.stone_storage]: {
    pointsF: (p: PlayerType) => p.resources?.stone || 0,
    cost: { wood: 3, ore: 1 },
  },
  [Tile.ore_storage]: {
    pointsF: (p: PlayerType) => Math.floor((p.resources?.ore || 0) / 2),
    cost: { wood: 1, stone: 2 },
  },
  [Tile.spare_part_storage]: {
    points: 0,
    cost: { wood: 2 },
    // TODO
  },
  [Tile.main_storage]: {
    points: 3,
    cost: { wood: 2, stone: 1 },
    // TODO
  },
  [Tile.weapon_storage]: {
    pointsF: (p: PlayerType) =>
      (p.availableDwarves || [])
        .concat(p.usedDwarves || [])
        .filter((d) => d > 0).length,
    cost: { wood: 3, stone: 2 },
  },
  [Tile.supplies_storage]: {
    pointsF: (p: PlayerType) =>
      (p.availableDwarves || [])
        .concat(p.usedDwarves || [])
        .filter((d) => d <= 0).length === 0
        ? 8
        : 0,
    cost: { wood: 1, food: 3 },
  },
  [Tile.broom_chamber]: {
    pointsF: (p: PlayerType) =>
      Math.max(
        0,
        5 * ((p.availableDwarves || []).concat(p.usedDwarves || []).length - 4)
      ),
    cost: { wood: 1 },
  },
  [Tile.treasure_chamber]: {
    pointsF: (p: PlayerType) => p.resources?.rubies || 0,
    cost: { wood: 1, stone: 1 },
  },
  [Tile.food_chamber]: {
    pointsF: (p: PlayerType) =>
      2 * Math.min(p.resources?.grain || 0, p.resources?.vegetables || 0),
    cost: { wood: 2, vegetables: 2 },
  },
  [Tile.prayer_chamber]: {
    pointsF: (p: PlayerType) =>
      (p.availableDwarves || [])
        .concat(p.usedDwarves || [])
        .filter((d) => d > 0).length === 0
        ? 8
        : 0,
    cost: { wood: 2 },
  },
  [Tile.writing_chamber]: {
    points: 0,
    cost: { stone: 2 },
    // TODO
  },
  [Tile.fodder_chamber]: {
    pointsF: (p: PlayerType) =>
      Math.floor(
        ((p.resources?.sheep || 0) +
          (p.resources?.donkeys || 0) +
          (p.resources?.boars || 0) +
          (p.resources?.cows || 0)) /
          3
      ),
    cost: { grain: 2, stone: 1 },
  },
};

export default Tiles;
