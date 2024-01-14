import SharedUtils from "../../../../shared/shared";
import store, { StoreType } from "../../../../shared/store";

import { GameType, PlayerType } from "./NewGame";

const store_: StoreType<GameType> = store;
const shared: SharedUtils<GameType, PlayerType> = new SharedUtils();

function sortBoard(game: GameType) {
  game.board.sort((a, b) => a - b);
}

export { shared, sortBoard, store_ as store };
