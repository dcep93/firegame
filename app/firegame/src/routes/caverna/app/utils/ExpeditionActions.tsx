import { PlayerType, ResourcesType } from "./NewGame";

export enum ExpeditionAction {
  strength,
  wood,
  dog,
  grain,
  sheep,
  stone,
  donkey,
  vegetable,
  ore_2,
  boar,
  gold_2,
  furnish,
  stable,
  tunnel,
  fence_1,
  cow,
  fence_2,
  pasture,
  dwelling_2_2,
  field,
  sow,
  cavern,
  breed_2,
}

const ExpeditionActions: {
  [a in ExpeditionAction]: {
    level: number;
    action?: (p: PlayerType) => void;
    reward?: ResourcesType;
  };
} = {
  [ExpeditionAction.strength]: {
    level: 1,
    // TODO
  },
  [ExpeditionAction.wood]: { level: 1, reward: { wood: 1 } },
  [ExpeditionAction.dog]: { level: 1, reward: { dogs: 1 } },
  [ExpeditionAction.grain]: { level: 2, reward: { grain: 1 } },
  [ExpeditionAction.sheep]: { level: 2, reward: { sheep: 1 } },
  [ExpeditionAction.stone]: { level: 3, reward: { stone: 1 } },
  [ExpeditionAction.donkey]: { level: 3, reward: { donkeys: 1 } },
  [ExpeditionAction.vegetable]: { level: 4, reward: { vegetables: 1 } },
  [ExpeditionAction.ore_2]: { level: 4, reward: { ore: 2 } },
  [ExpeditionAction.boar]: { level: 5, reward: { boars: 1 } },
  [ExpeditionAction.gold_2]: { level: 6, reward: { gold: 2 } },
  [ExpeditionAction.furnish]: {
    level: 7,
    // TODO
  },
  [ExpeditionAction.stable]: {
    level: 8,
    // TODO
  },
  [ExpeditionAction.tunnel]: {
    level: 9,
    // TODO
  },
  [ExpeditionAction.fence_1]: {
    level: 9,
    // TODO
  },
  [ExpeditionAction.cow]: { level: 10, reward: { cows: 1 } },
  [ExpeditionAction.fence_2]: {
    level: 10,
    // TODO
  },
  [ExpeditionAction.pasture]: {
    level: 11,
    // TODO
  },
  [ExpeditionAction.dwelling_2_2]: {
    level: 11,
    // TODO
  },
  [ExpeditionAction.field]: {
    level: 12,
    // TODO
  },
  [ExpeditionAction.sow]: {
    level: 12,
    // TODO
  },
  [ExpeditionAction.cavern]: {
    level: 14,
    // TODO
  },
  [ExpeditionAction.breed_2]: {
    level: 14,
    // TODO
  },
};

export default ExpeditionActions;
