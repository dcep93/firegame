import Shared from "../../../../shared/shared";
import store, { StoreType } from "../../../../shared/store";

import { GameType, PlayerType } from "./NewGame";

const store_: StoreType<GameType> = store;

class Utils extends Shared<GameType, PlayerType> {
	advanceTurn() {
		for (let i = 1; i < store_.gameW.game.players.length; i++) {
			utils.incrementPlayerTurn();
			if (utils.getCurrent().hand) return true;
		}
		return false;
	}
}

const utils = new Utils();

export default utils;

export { store_ as store };
