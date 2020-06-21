import { LobbyType } from "../../../../shared/store";

import utils, { store } from "./utils";

export type GameType = {
	params: Params;
	currentPlayer: number;
	players: PlayerType[];
	cardW?: CardW;
	clue?: string;
	lastRound?: {
		cluer: string;
		answerer: string;
		answer: number;
		target: number;
		cardW: CardW;
		clue: string;
	};
};

export type CardW = { target: number; difficulty: Difficulty; card: Card };

export type Params = {
	lobby: LobbyType;
};

export type PlayerType = {
	userId: string;
	userName: string;
	clues: number;
	points: number;
};

export enum Difficulty {
	easy,
	hard,
}

export type Card = {
	a: string;
	b: string;
};

function NewGame(params: Params): PromiseLike<GameType> {
	// @ts-ignore game being constructed
	const game: GameType = {};
	game.params = params;
	return Promise.resolve(game).then(setPlayers);
}

function setPlayers(game: GameType): GameType {
	game.players = Object.entries(store.lobby)
		.sort((a, b) => (b[0] === store.me.userId ? 1 : -1))
		.map(([userId, userName]) => ({
			userId,
			userName,
			clues: 0,
			points: 0,
		}));
	game.currentPlayer = utils.myIndex(game);
	return game;
}

export default NewGame;
