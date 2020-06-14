import { LobbyType } from "../../../../shared/store";

import utils, { store } from "./utils";
import bank, { Token, Card, TokensGroup } from "./bank";

export type GameType = {
	params: Params;
	currentPlayer: number;
	players: PlayerType[];
	cards: { [n: number]: Card[] };
	nobles: TokensGroup[];
	tokens: TokensGroup;
};

export type Params = {
	lobby: LobbyType;
};

export type PlayerType = {
	userId: string;
	userName: string;
	tokens?: TokensGroup;
};

function NewGame(params: Params): PromiseLike<GameType> {
	// @ts-ignore game being constructed
	const game: GameType = {};
	game.params = params;
	return Promise.resolve(game)
		.then(setPlayers)
		.then(setCards)
		.then(setNobles)
		.then(setTokens);
}

function setPlayers(game: GameType): GameType {
	game.players = Object.entries(store.lobby)
		.sort((a, b) => (b[0] === store.me.userId ? 1 : -1))
		.map(([userId, userName]) => ({
			userId,
			userName,
		}));
	game.currentPlayer = utils.myIndex(game);
	return game;
}

function setCards(game: GameType): GameType {
	game.cards = {};
	for (let i = 1; i <= 3; i++) {
		game.cards[i] = utils.shuffle(bank.cards.filter((c) => c.level === i));
	}
	return game;
}

function setNobles(game: GameType): GameType {
	game.nobles = utils.shuffle(bank.nobles).slice(0, game.players.length + 1);
	return game;
}

function setTokens(game: GameType): GameType {
	const tokens: { [t in Token]?: number } = {};
	utils.enumArray(Token).forEach((t: Token) => {
		var count;
		if (t === Token.gold) {
			count = 5;
		} else if (game.players.length === 2) {
			count = 4;
		} else if (game.players.length === 3) {
			count = 5;
		} else {
			count = 7;
		}
		tokens[t] = count;
	});
	game.tokens = tokens;
	return game;
}

export default NewGame;
