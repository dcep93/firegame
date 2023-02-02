import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";

import { GameType, PlayerType } from "./NewGame";

const store: StoreType<GameType> = store_;

class Utils extends Shared<GameType, PlayerType> {
  getNewPolicies(): boolean[] {
    return this.shuffle(this.repeat(true, 6).concat(this.repeat(false, 11)));
  }
}

const utils = new Utils();

export default utils;

export { store };
