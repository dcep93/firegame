import { ResourcesType } from "./NewGame";
import { store } from "./utils";

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
  enrichment?: ResourcesType[];
  action?: () => void;
};

const Actions: { [a in Action]: ActionType } = {
  [Action.blacksmithing]: {
    availability: [-1, 0],
    action: () => store.gameW.game.tasks,
  },
  [Action.ore_mine_construction]: {
    availability: [-1, 0],
    // TODO
  },
  [Action.sheep_farming]: {
    availability: [-1, 0],
    // TODO
  },
  [Action.wish_for_children]: {
    availability: [-1.5, 0],
    // TODO
  },
  [Action.ruby_mine_construction]: {
    availability: [-2, 0],
    // TODO
  },
  [Action.donkey_farming]: {
    availability: [-2, 0],
    // TODO
  },
  [Action.exploration]: {
    availability: [-3, 0],
    // TODO
  },
  [Action.family_life]: {
    availability: [-3, 0],
    // TODO
  },
  [Action.ore_delivery]: {
    availability: [-3, 0],
    // TODO
  },
  [Action.ore_trading]: {
    availability: [-4, 0],
    // TODO
  },
  [Action.ruby_delivery]: {
    availability: [-4, 0],
    // TODO
  },
  [Action.adventure]: {
    availability: [-4, 0],
    // TODO
  },
  [Action.ruby_mining]: {
    availability: [1, 7],
    // TODO
  },
  [Action.housework]: {
    availability: [1, 7],
    // TODO
  },
  [Action.slash_and_burn]: {
    availability: [1, 7],
    // TODO
  },
  [Action.drift_mining_1_3]: {
    availability: [1, 3],
    // TODO
  },
  [Action.excavation_1_3]: {
    availability: [1, 3],
    // TODO
  },
  [Action.starting_player_1_3]: {
    availability: [1, 3],
    // TODO
  },
  [Action.logging_1_3]: {
    availability: [1, 3],
    // TODO
  },
  [Action.supplies]: {
    availability: [1, 3],
    // TODO
  },
  [Action.ore_mining_1_3]: {
    availability: [1, 3],
    // TODO
  },
  [Action.wood_gathering]: {
    availability: [1, 3],
    // TODO
  },
  [Action.clearing_1_3]: {
    availability: [1, 3],
    // TODO
  },
  [Action.sustenance_1_3]: {
    availability: [1, 3],
    // TODO
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
    // TODO
  },
  [Action.excavation_4_7]: {
    availability: [4, 7],
    // TODO
  },
  [Action.starting_player_4_7]: {
    availability: [4, 7],
    // TODO
  },
  [Action.imitation_4_7]: {
    availability: [4, 7],
    // TODO
  },
  [Action.logging_4_7]: {
    availability: [4, 7],
    // TODO
  },
  [Action.forest_exploration_4_7]: {
    availability: [4, 7],
    // TODO
  },
  [Action.growth]: {
    availability: [4, 7],
    // TODO
  },
  [Action.clearing_4_7]: {
    availability: [4, 7],
    // TODO
  },
  [Action.ore_mining_4_7]: {
    availability: [4, 7],
    // TODO
  },
  [Action.sustenance_4_7]: {
    availability: [4, 7],
    // TODO
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
