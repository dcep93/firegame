import { Buildable, PlayerType, ResourcesType, Task } from "./NewGame";
import utils from "./utils";

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
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.build, d: { num: 1, build: Buildable.pasture } },
      ]),
  },
  [RubyAction.field]: {
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.build, d: { num: 1, build: Buildable.field } },
      ]),
  },
  [RubyAction.tunnel]: {
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.build, d: { num: 1, build: Buildable.tunnel } },
      ]),
  },
  [RubyAction.cow]: { reward: { cows: 1 }, cost: { rubies: 1, food: 1 } },
  [RubyAction.cavern]: {
    cost: { rubies: 2 },
    action: (p: PlayerType) =>
      utils.queueTasks([
        { t: Task.build, d: { num: 1, build: Buildable.cavern } },
      ]),
  },
};

export default RubyActions;
