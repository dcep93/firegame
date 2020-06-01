import Shared from "../../../../shared/shared";
import store, { StoreType } from "../../../../shared/store";

import { GameType, PlayerType } from "./NewGame";

const store_: StoreType<GameType> = store;
const utils: Shared<GameType, PlayerType> = new Shared();

export default utils;

export { store_ as store };
