import { LobbyType } from "../../../../shared/store";

import { store, shared, deal } from ".";

export type GameType = {
	params: Params;
	currentPlayer: number;
	players: PlayerType[];
	age: Age;
	structure: StructureCardType[][];
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
	wonders: WonderType[];
	money: number;
};

export interface CardType {
	name: string;
	age: Age;
	color: Color;
	cost: Resource[];
	upgradesTo?: string;
	upgradesFrom?: string;
}

export enum Age {
	one = 1,
	two,
	three,
}

export enum Resource {
	money = "$",
	clay = "c",
	stone = "s",
	wood = "w",
}

export enum Color {
	brown = "brown",
	grey = "grey",
	yellow = "yellow",
	red = "red",
	blue = "blue",
	green = "green",
	purple = "purple",
	guild = "guild",
}

export type WonderType = {};

function NewGame(params: Params): PromiseLike<GameType> {
	// @ts-ignore game being constructed
	const game: GameType = {};
	game.params = params;
	return Promise.resolve(game).then(setPlayers).then(dealFirstAge);
}

function setPlayers(game: GameType): GameType {
	game.players = Object.entries(store.lobby).map(([userId, userName]) => ({
		userId,
		userName,
		cards: [],
		wonders: [],
		money: 7,
	}));
	game.currentPlayer = shared.myIndex(game);
	return game;
}

function dealFirstAge(game: GameType): GameType {
	game.age = Age.one;
	deal(game);
	return game;
}

export default NewGame;
