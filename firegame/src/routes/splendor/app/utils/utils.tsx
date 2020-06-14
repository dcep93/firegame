import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";

import { GameType, PlayerType } from "./NewGame";
import { Token } from "./bank";

const store: StoreType<GameType> = store_;

class Utils extends Shared<GameType, PlayerType> {
	finishTurn(message: string) {
		if (!store.gameW.game.tooManyTokens) utils.incrementPlayerTurn();
		store.update(message);
	}

	gainToken(token: Token, num: number = 1) {
		store.gameW.game.tokens[token] -= num;
		const me = utils.getMe();
		if (!me.tokens) me.tokens = [];
		me.tokens.push(...Array.from(new Array(num)).map((_) => Token.gold));
		if (me.tokens.length > 10)
			// todo tooManyTokens
			store.gameW.game.tooManyTokens = true;
	}
}

const utils = new Utils();

export default utils;

export { store };
