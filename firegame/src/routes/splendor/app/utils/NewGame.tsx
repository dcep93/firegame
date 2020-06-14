import { LobbyType } from "../../../../shared/store";

import utils, { store } from "./utils";
import bank, { Token, Card, TokensGroup, Level } from "./bank";

export type GameType = {
	params: Params;
	currentPlayer: number;
	players: PlayerType[];
	cards: { [l in Level]?: Card[] };
	nobles?: { [t in Token]?: number }[];
	tokens: { [t in Token]: number };
	tooManyTokens?: boolean;
};

export type Params = {
	lobby: LobbyType;
};

export type PlayerType = {
	userId: string;
	userName: string;
	tokens?: Token[];
	hand?: Card[];
	cards?: Card[];
	nobles: number;
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
			nobles: 0,
		}));
	game.currentPlayer = utils.myIndex(game);
	return game;
}

function setCards(game: GameType): GameType {
	// @ts-ignore initializing cards
	game.cards = {};
	utils.enumArray(Level).forEach((l: Level) => {
		game.cards[l] = utils.shuffle(bank.cards.filter((c) => c.level === l));
	});
	return game;
}

function setNobles(game: GameType): GameType {
	game.nobles = utils.shuffle(bank.nobles).slice(0, game.players.length + 1);
	return game;
}

function setTokens(game: GameType): GameType {
	// @ts-ignore initializing tokens
	game.tokens = {};
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
		game.tokens[t] = count;
	});
	return game;
}

export default NewGame;
