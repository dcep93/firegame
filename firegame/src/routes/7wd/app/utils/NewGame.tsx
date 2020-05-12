import { LobbyType } from "../../../../shared/store";

import { store, utils, deal } from ".";
import bank, { Age, ScienceToken } from "./bank";

const NUM_SCIENCES = 5;

export type GameType = {
	params: Params;
	currentPlayer: number;
	players: PlayerType[];
	age: Age;
	structure: StructureCardType[][];
	trash: number[];
	commercial?: CommercialEnum;
	sciences: ScienceToken[];
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
	military: number;
	index: number;
	militaryBonuses: { [x: number]: number };
	sciences: ScienceToken[];
};

export enum CommercialEnum {
	science,
}

export const commercials: { [c in CommercialEnum]: string } = {
	[CommercialEnum.science]: "select a science token",
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
	game.trash = [];
	// @ts-ignore
	game.sciences = utils
		.shuffle(Object.keys(bank.sciences))
		.slice(NUM_SCIENCES);
	return game;
}

function setPlayers(game: GameType): GameType {
	game.players = Object.entries(store.lobby).map(
		([userId, userName], index) => ({
			userId,
			userName,
			cards: [],
			wonders: [],
			money: 7,
			military: 0,
			index,
			militaryBonuses: { 3: 2, 6: 5, 9: 0 },
			sciences: [],
		})
	);
	game.currentPlayer = utils.myIndex(game);
	return game;
}

function dealFirstAge(game: GameType): GameType {
	game.age = Age.one;
	deal(game);
	return game;
}

export default NewGame;
