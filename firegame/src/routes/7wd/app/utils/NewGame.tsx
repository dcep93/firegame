import { LobbyType } from "../../../../shared/store";

import { store, shared, deal } from ".";

export type GameType = {
	params: Params;
	currentPlayer: number;
	players: PlayerType[];
	age: Age;
	structure: StructureRow[];
};

export type Params = {
	lobby: LobbyType;
};

export type StructureRow = {
	[position: string]: { cardIndex: number; revealed: boolean };
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
	cost: { [resource in Resource]?: number };
	upgradesTo?: string;
	upgradesFrom?: string;
}

export enum Age {
	one = 1,
	two,
	three,
}

export enum Resource {
	money,
	clay,
	stone,
	wood,
}

export enum Color {
	brown,
	grey,
	yellow,
	red,
	blue,
	green,
	purple,
	guild,
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
