import store, { StoreType } from "../../../../shared/store";

import { GameType } from "./NewGame";

const store_: StoreType<GameType> = store;

function sortBoard(game: GameType) {
	game.board.sort((a, b) => b - a);
}

export { store_ as store, sortBoard };
