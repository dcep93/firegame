import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";

import { GameType, PlayerType } from "./NewGame";
import { Token, Card, TokenToEmoji } from "./bank";

const store: StoreType<GameType> = store_;

export const MAX_HAND_TOKENS = 10;

class Utils extends Shared<GameType, PlayerType> {
	finishTurn(message: string) {
		if (!store.gameW.game.tooManyTokens) utils.incrementPlayerTurn();
		if (store.gameW.game.over && store.gameW.game.currentPlayer === 0)
			store.gameW.info.alert = "game over";
		store.update(message);
	}

	gainToken(token: Token, num: number = 1) {
		store.gameW.game.tokens[token] -= num;
		const me = utils.getMe();
		if (!me.tokens) me.tokens = [];
		me.tokens.push(...Array.from(new Array(num)).map((_) => token));
		if (me.tokens.length > MAX_HAND_TOKENS)
			store.gameW.game.tooManyTokens = true;
	}

	cardString(card: Card): string {
		return `${TokenToEmoji[card.color]} - (${
			card.points
		}): ${Object.entries(card.price)
			.map(([t, n]) => `${TokenToEmoji[parseInt(t) as Token]} x${n}`)
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
