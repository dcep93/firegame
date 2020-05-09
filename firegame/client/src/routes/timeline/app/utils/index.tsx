import Shared from "../../../../shared";
import store, { StoreType } from "../../../../shared/store";

import { GameType, PlayerType } from "./NewGame";

const store_: StoreType<GameType> = store;
const shared: Shared<GameType, PlayerType> = new Shared();

function sortBoard(game: GameType) {
	game.board.sort((a, b) => b - a);
}

export { store_ as store, sortBoard, shared };
