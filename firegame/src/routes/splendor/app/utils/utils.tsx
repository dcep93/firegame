import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";

import { GameType, PlayerType } from "./NewGame";
import { Token, Card } from "./bank";

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
		me.tokens.push(...Array.from(new Array(num)).map((_) => token));
		if (me.tokens.length > 10)
			// todo tooManyTokens
			store.gameW.game.tooManyTokens = true;
	}

	cardString(card: Card): string {
		return `${Token[card.color]} - (${card.points}): ${Object.entries(
			card.price
		)
			.map(([t, n]) => `${Token[parseInt(t)]} x${n}`)
			.join(" / ")}`;
	}

	getScore(player: PlayerType): number {
		return (
			(player.cards || [])
				.map((c) => c.points)
				.reduce((a, b) => a + b, 0) +
			player.nobles * 3
		);
	}
}

const utils = new Utils();

export default utils;

export { store };
