import Shared from "../../../../shared/shared";
import store, { StoreType } from "../../../../shared/store";

import { GameType, PlayerType } from "./NewGame";

const store_: StoreType<GameType> = store;

class Utils extends Shared<GameType, PlayerType> {}

const utils = new Utils();

export default utils;

export { store_ as store };