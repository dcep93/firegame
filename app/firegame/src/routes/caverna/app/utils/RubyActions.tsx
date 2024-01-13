import { PlayerType, ResourcesType } from "./NewGame";

export enum RubyAction {
  dog,
  grain,
  vegetable,
  sheep,
  wood,
  donkey,
  stone,
  boar,
  ore,
  pasture,
  field,
  tunnel,
  cow,
  cavern,
}

const RubyActions: {
  [a in RubyAction]: {
    action?: (p: PlayerType) => void;
    reward?: ResourcesType;
    cost?: ResourcesType;
  };
} = {
  [RubyAction.dog]: { reward: { dogs: 1 } },
  [RubyAction.grain]: { reward: { grain: 1 } },
  [RubyAction.vegetable]: { reward: { vegetables: 1 } },
  [RubyAction.sheep]: { reward: { sheep: 1 } },
  [RubyAction.wood]: { reward: { wood: 1 } },
  [RubyAction.donkey]: { reward: { donkeys: 1 } },
  [RubyAction.stone]: { reward: { stone: 1 } },
  [RubyAction.boar]: { reward: { boars: 1 } },
  [RubyAction.ore]: { reward: { ore: 1 } },
  [RubyAction.pasture]: {
    // TODO
  },
  [RubyAction.field]: {
    // TODO
  },
  [RubyAction.tunnel]: {
    // TODO
  },
  [RubyAction.cow]: { reward: { cows: 1 }, cost: { rubies: -1, food: -1 } },
  [RubyAction.cavern]: {
    cost: { rubies: -2 },
    // TODO
  },
};

export default RubyActions;
