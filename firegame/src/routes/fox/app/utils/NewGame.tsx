import { LobbyType } from "../../../../shared/store";

import { deal, shared } from "./";

export type GameType = {
	params: Params;
	currentPlayer: number;
	players: PlayerType[];
	dealer: number;
	deck: Card[];
	lead: Card | null;
	trump: Card;
	staging: Card | null;
	previous: string;
};

export type Params = {
	lobby: LobbyType;
};

export type PlayerType = {
	hand: Card[];
	tricks: number;
	score: number;
	userId: string;
	userName: string;
};

export type Card = { suit: string; value: number };

function NewGame(params: Params): PromiseLike<GameType> {
	// @ts-ignore game being constructed
	const game: GameType = {};
	game.params = params;
	return Promise.resolve(game)
		.then(createPlayers)
		.then(setDefault)
		.then(deal);
}

function createPlayers(game: GameType): GameType {
	game.players = Object.keys(game.params.lobby).map(
		(userId, index: number) => ({
			hand: [],
			tricks: 0,
			score: 0,
			userId,
			userName: game.params.lobby[userId],
		})
	);
	return game;
}

function setDefault(game: GameType): GameType {
	game.dealer = shared.myIndex(game);
	game.previous = "new game";
	return game;
}

export default NewGame;
