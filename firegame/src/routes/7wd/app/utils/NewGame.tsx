import { LobbyType } from "../../../../shared/store";

import { store, utils } from ".";
import bank, { Age, ScienceToken } from "./bank";

export type GameType = {
	params: Params;
	currentPlayer: number;
	players: PlayerType[];
	age: Age;
	structure: StructureCardType[][];
	trash: number[];
	commercial?: CommercialEnum;
	sciences: ScienceToken[];
	wentFirst: number;
	extra: any;
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
	chooseWonder,
	destroyGrey,
	destroyBrown,
	revive,
	library,
}

export const commercials: { [c in CommercialEnum]: string } = {
	[CommercialEnum.science]: "select a science token",
	[CommercialEnum.chooseWonder]: "choose a wonder",
	[CommercialEnum.destroyGrey]: "destroy a grey card",
	[CommercialEnum.destroyBrown]: "destroy a brown card",
	[CommercialEnum.revive]: "construct a card from discard",
	[CommercialEnum.library]: "choose a science token",
};

function NewGame(params: Params): PromiseLike<GameType> {
	// @ts-ignore game being constructed
	const game: GameType = {};
	game.params = params;
	return Promise.resolve(game)
		.then(setBoard)
		.then(setPlayers)
		.then(prepareToChooseWonders);
}

function setBoard(game: GameType): GameType {
	game.trash = [];
	// @ts-ignore
	game.sciences = utils.shuffle(Object.keys(bank.sciences));
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
	if (game.players.length !== 2) throw new Error("need 2 players");
	game.currentPlayer = utils.myIndex(game);
	return game;
}

function prepareToChooseWonders(game: GameType): GameType {
	game.commercial = CommercialEnum.chooseWonder;
	game.extra = {
		firstRound: true,
		remaining: 4,
		wonders: utils.shuffle(Object.keys(bank.wonders)),
	};
	return game;
}

export default NewGame;
