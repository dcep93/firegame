import {
  Buildable,
  CaveTileType,
  PlayerType,
  ResourcesType,
  Task,
} from "./NewGame";
import utils, { store } from "./utils";

export enum Action {
  // 0-1
  blacksmithing,
  ore_mine_construction,
  sheep_farming,
  // 0-2
  wish_for_children,
  ruby_mine_construction,
  donkey_farming,
  // 0-3
  exploration,
  family_life,
  ore_delivery,
  // 0-4
  ore_trading,
  ruby_delivery,
  adventure,
  // 1-7
  ruby_mining,
  housework,
  slash_and_burn,
  // 1-3
  drift_mining_1_3,
  excavation_1_3,
  starting_player_1_3,
  logging_1_3,
  supplies,
  ore_mining_1_3,
  wood_gathering,
  clearing_1_3,
  sustenance_1_3,
  // 3
  strip_mining,
  forest_exploration_3,
  imitation_3,
  // 4-7
  drift_mining_4_7,
  excavation_4_7,
  starting_player_4_7,
  imitation_4_7,
  logging_4_7,
  forest_exploration_4_7,
  growth,
  clearing_4_7,
  ore_mining_4_7,
  sustenance_4_7,
  // 5
  depot_5,
  small_scale_drift_mining,
  weekly_market_5,
  imitation_5,
  hardware_rental_5,
  fence_building_5,
  // 6-7
  depot_6_7,
  drift_mining_6_7,
  weekly_market_6_7,
  imitation_6_7,
  hardware_rental_6_7,
  fence_building_6_7,
  // 7
  large_depot,
  imitation_7,
  extension,
}

export type ActionType = {
  availability: [number, number];
  foodCost?: number;
  enrichment?: ResourcesType[];
  action?: (p: PlayerType) => void;
};

const Actions: { [a in Action]: ActionType } = {
  [Action.blacksmithing]: {
    availability: [-1, 0],
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.forge },
        { t: Task.expedition, d: { num: 3 } },
      ]),
  },
  [Action.ore_mine_construction]: {
    availability: [-1, 0],
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.build, d: { toBuild: Buildable.ruby_mine } },
        { t: Task.expedition, d: { num: 2 } },
      ]),
  },
  [Action.sheep_farming]: {
    availability: [-1, 0],
    enrichment: [{ sheep: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.build, d: { num: 2, toBuild: Buildable.fence } },
        {
          t: Task.build,
          d: { num: 4, toBuild: Buildable.double_fence },
        },
        { t: Task.build, d: { num: 1, toBuild: Buildable.stable } },
      ]),
  },
  [Action.wish_for_children]: {
    availability: [-1.5, 0],
    action: (p: PlayerType) =>
      utils.queueTasks([{ t: Task.wish_for_children }]),
  },
  [Action.ruby_mine_construction]: {
    availability: [-2, 0],
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.build, d: { toBuild: Buildable.ruby_mine } },
      ]),
  },
  [Action.donkey_farming]: {
    availability: [-2, 0],
    enrichment: [{ donkeys: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.build, d: { num: 2, toBuild: Buildable.fence } },
        {
          t: Task.build,
          d: { num: 4, toBuild: Buildable.double_fence },
        },
        { t: Task.build, d: { num: 1, toBuild: Buildable.stable } },
      ]),
  },
  [Action.exploration]: {
    availability: [-3, 0],
    action: (p: PlayerType) =>
      utils.queueTasks([{ t: Task.expedition, d: { num: 4 } }]),
  },
  [Action.family_life]: {
    availability: [-3, 0],
    action: (p: PlayerType) =>
      utils.queueTasks([{ t: Task.sow }, { t: Task.have_baby }]),
  },
  [Action.ore_delivery]: {
    availability: [-3, 0],
    enrichment: [{ stone: 1, ore: 1 }],
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, {
        ore:
          2 *
          utils.getGrid(p).filter(({ t }) => (t as CaveTileType).isMine).length,
      }),
  },
  [Action.ore_trading]: {
    availability: [-4, 0],
    action: (p: PlayerType) =>
      utils.queueTasks([{ t: Task.ore_trading, d: { num: 3 } }]),
  },
  [Action.ruby_delivery]: {
    availability: [-4, 0],
    enrichment: [{ rubies: 2 }, { rubies: 1 }],
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, {
        rubies:
          utils.getGrid(p).filter(({ t }) => (t as CaveTileType).isRubyMine)
            .length >= 2
            ? 1
            : 0,
      }),
  },
  [Action.adventure]: {
    availability: [-4, 0],
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.forge },
        { t: Task.expedition, d: { num: 1 } },
        { t: Task.expedition, d: { num: 1 } },
      ]),
  },
  [Action.ruby_mining]: {
    availability: [1, 7],
    enrichment: [{ rubies: 1 }],
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, {
        rubies:
          utils.getGrid(p).filter(({ t }) => (t as CaveTileType).isRubyMine)
            .length >= 1
            ? 1
            : 0,
      }),
  },
  [Action.housework]: {
    availability: [1, 7],
    action: (p: PlayerType) => utils.queueTasks([{ t: Task.furnish_cavern }]),
  },
  [Action.slash_and_burn]: {
    availability: [1, 7],
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.build, d: { toBuild: Buildable.farm_tile } },
        { t: Task.sow },
      ]),
  },
  [Action.drift_mining_1_3]: {
    availability: [1, 3],
    enrichment: [{ stone: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.build, d: { toBuild: Buildable.cavern_tunnel } },
      ]),
  },
  [Action.excavation_1_3]: {
    availability: [1, 3],
    enrichment: [{ stone: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        {
          t: Task.choose_excavation,
        },
      ]),
  },
  [Action.starting_player_1_3]: {
    availability: [1, 3],
    enrichment: [{ food: 1 }],
    action: (p: PlayerType) => {
      utils.addResourcesToPlayer(p, { ore: 2 });
      store.gameW.game.currentPlayer = utils.myIndex();
    },
  },
  [Action.logging_1_3]: {
    availability: [1, 3],
    enrichment: [{ wood: 3 }, { wood: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        {
          t: Task.expedition,
          d: { num: 1 },
        },
      ]),
  },
  [Action.supplies]: {
    availability: [1, 3],
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, {
        wood: 1,
        stone: 1,
        ore: 1,
        food: 1,
        gold: 2,
      }),
  },
  [Action.ore_mining_1_3]: {
    availability: [1, 3],
    enrichment: [{ ore: 2 }, { ore: 1 }],
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, {
        ore:
          2 *
          utils.getGrid(p).filter(({ t }) => (t as CaveTileType).isMine).length,
      }),
  },
  [Action.wood_gathering]: {
    availability: [1, 3],
    enrichment: [{ wood: 1 }],
  },
  [Action.clearing_1_3]: {
    availability: [1, 3],
    enrichment: [{ wood: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        {
          t: Task.build,
          d: { toBuild: Buildable.farm_tile },
        },
      ]),
  },
  [Action.sustenance_1_3]: {
    availability: [1, 3],
    enrichment: [{ food: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        {
          t: Task.build,
          d: { toBuild: Buildable.farm_tile },
        },
      ]),
  },
  [Action.strip_mining]: {
    availability: [3, 3],
    // TODO
  },
  [Action.forest_exploration_3]: {
    availability: [3, 3],
    // TODO
  },
  [Action.imitation_3]: {
    availability: [3, 3],
    // TODO
  },
  [Action.drift_mining_4_7]: {
    availability: [4, 7],
    enrichment: [{ stone: 2 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        {
          t: Task.build,
          d: { toBuild: Buildable.cavern_tunnel },
        },
      ]),
  },
  [Action.excavation_4_7]: {
    availability: [4, 7],
    enrichment: [{ stone: 2 }, { stone: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        {
          t: Task.choose_excavation,
        },
      ]),
  },
  [Action.starting_player_4_7]: {
    availability: [4, 7],
    enrichment: [{ food: 1 }],
    action: (p: PlayerType) => utils.addResourcesToPlayer(p, { rubies: 1 }),
  },
  [Action.imitation_4_7]: {
    availability: [4, 7],
    foodCost: 2,
    action: (p: PlayerType) =>
      utils.queueTasks([
        {
          t: Task.imitate,
        },
      ]),
  },
  [Action.logging_4_7]: {
    availability: [4, 7],
    enrichment: [{ wood: 3 }],
    action: (p: PlayerType) =>
      utils.queueTasks([{ t: Task.expedition, d: { num: 2 } }]),
  },
  [Action.forest_exploration_4_7]: {
    availability: [4, 7],
    enrichment: [{ wood: 2 }, { wood: 1 }],
    action: (p: PlayerType) => utils.addResourcesToPlayer(p, { food: 2 }),
  },
  [Action.growth]: {
    availability: [4, 7],
    action: (p: PlayerType) => {
      utils.queueTasks([
        {
          t: Task.growth,
        },
      ]);
    },
  },
  [Action.clearing_4_7]: {
    availability: [4, 7],
    enrichment: [{ wood: 2 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.build, d: { toBuild: Buildable.farm_tile } },
      ]),
  },
  [Action.ore_mining_4_7]: {
    availability: [4, 7],
    enrichment: [{ ore: 3 }, { ore: 2 }],
    action: (p: PlayerType) =>
      utils.addResourcesToPlayer(p, {
        ore:
          2 *
          utils.getGrid(p).filter(({ t }) => (t as CaveTileType).isMine).length,
      }),
  },
  [Action.sustenance_4_7]: {
    availability: [4, 7],
    enrichment: [{ grain: 1 }, { vegetables: 1 }],
    action: (p: PlayerType) =>
      utils.queueTasks([
        {
          t: Task.build,
          d: { toBuild: Buildable.farm_tile },
        },
      ]),
  },
  [Action.depot_5]: {
    availability: [5, 5],
    // TODO
  },
  [Action.small_scale_drift_mining]: {
    availability: [5, 5],
    // TODO
  },
  [Action.weekly_market_5]: {
    availability: [5, 5],
    // TODO
  },
  [Action.imitation_5]: {
    availability: [5, 5],
    // TODO
  },
  [Action.hardware_rental_5]: {
    availability: [5, 5],
    // TODO
  },
  [Action.fence_building_5]: {
    availability: [5, 5],
    // TODO
  },
  [Action.depot_6_7]: {
    availability: [6, 7],
    // TODO
  },
  [Action.drift_mining_6_7]: {
    availability: [6, 7],
    // TODO
  },
  [Action.weekly_market_6_7]: {
    availability: [6, 7],
    // TODO
  },
  [Action.imitation_6_7]: {
    availability: [6, 7],
    // TODO
  },
  [Action.hardware_rental_6_7]: {
    availability: [6, 7],
    // TODO
  },
  [Action.fence_building_6_7]: {
    availability: [6, 7],
    // TODO
  },
  [Action.large_depot]: {
    availability: [7, 7],
    // TODO
  },
  [Action.imitation_7]: {
    availability: [7, 7],
    // TODO
  },
  [Action.extension]: {
    availability: [7, 7],
    // TODO
  },
};
export default Actions;
