import { LobbyType } from "../../../../shared/store";

import { store, utils, deal } from ".";
import { Age } from "./bank";

export type GameType = {
	params: Params;
	currentPlayer: number;
	players: PlayerType[];
	age: Age;
	structure: StructureCardType[][];
	military: number;
	trash: number[];
};

export type Params = {
	lobby: LobbyType;
};

export type StructureCardType = {
	cardIndex: number;
	offset: number;
	revealed: boolean;
	taken: boolean;
};

export type PlayerType = {
	userId: string;
	userName: string;
	cards: number[];
	wonders: { built: boolean; wonderIndex: number }[];
	money: number;
};

function NewGame(params: Params): PromiseLike<GameType> {
	// @ts-ignore game being constructed
	const game: GameType = {};
	game.params = params;
	return Promise.resolve(game)
		.then(setBoard)
		.then(setPlayers)
		.then(dealFirstAge);
}

function setBoard(game: GameType): GameType {
	game.military = 0;
	game.trash = [];
	return game;
}

function setPlayers(game: GameType): GameType {
	game.players = Object.entries(store.lobby).map(([userId, userName]) => ({
		userId,
		userName,
		cards: [],
		wonders: [],
		money: 7,
	}));
	game.currentPlayer = utils.myIndex(game);
	return game;
}

function dealFirstAge(game: GameType): GameType {
	game.age = Age.one;
	deal(game);
	return game;
}

export default NewGame;
