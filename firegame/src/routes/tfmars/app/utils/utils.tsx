import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import { Action, Game, Player } from "./types";

const store: StoreType<Game> = store_;

class Utils extends Shared<Game, Player> {
  finishAction(): void {
    // todo
    alert("Need to implement");
  }

  addAction(action: Action): void {
    const me = utils.getMe();
    if (!me.actionQueue) me.actionQueue = [];
    me.actionQueue.push(action);
  }
}

const utils = new Utils();

export default utils;

export { store };
