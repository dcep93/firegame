import SharedUtils from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";

import NewGame, { GameType, Params, PlayerType } from "./NewGame";

const store: StoreType<GameType> = store_;

class Utils extends SharedUtils<GameType, PlayerType> {
  getNewPolicies(): boolean[] {
    return this.shuffle(this.repeat(true, 6).concat(this.repeat(false, 11)));
  }

  newGame(params: Params) {
    return NewGame(params);
  }
}

const utils = new Utils();

export default utils;

export { store };
