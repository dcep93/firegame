import { LobbyType } from "../../../../shared/store";

import { store, utils, deal } from ".";
import bank, { Age, ScienceToken } from "./bank";

export type GameType = {
	params: Params;
	currentPlayer: number;
	players: PlayerType[];
	age: Age;
	structure: StructureCardType[][];
	trash?: number[];
	commercials?: CommercialType[];
	sciences: ScienceToken[];
	wentFirst: number;
	discounts: TokenType[];
	godTokens: TokenType[];
};

export type Params = {
	lobby: LobbyType;
	godExpansion: boolean;
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
	cards?: number[];
	wonders: { built: boolean; wonderIndex: number }[];
	money: number;
	military: number;
	index: number;
	militaryBonuses: { [x: number]: number };
	sciences?: ScienceToken[];
	tokens?: TokenType[];
};

export type CommercialType = {
	commercial: CommercialEnum;
	playerIndex: number;
	extra?: any;
};

export enum TokenType {
	egyptian,
	mesopotamian,
	greek,
	roman,
	phoenician,
	two,
	three,
	four,
}

export enum CommercialEnum {
	science,
	chooseWonder,
	destroyGrey,
	destroyBrown,
	revive,
	library,
	destroyWonder,
	pickGod,
}

export const commercials: { [c in CommercialEnum]: string } = {
	[CommercialEnum.science]: "select a science token",
	[CommercialEnum.chooseWonder]: "choose a wonder",
	[CommercialEnum.destroyGrey]: "destroy a grey card",
	[CommercialEnum.destroyBrown]: "destroy a brown card",
	[CommercialEnum.revive]: "construct a card from discard",
	[CommercialEnum.library]: "choose a science token",
	[CommercialEnum.destroyWonder]: "destroy one of your wonders",
	[CommercialEnum.pickGod]: "choose a god to add to the pantheon",
};

function NewGame(params: Params): PromiseLike<GameType> {
	// @ts-ignore game being constructed
	const game: GameType = {};
	game.params = params;
	return Promise.resolve(game)
		.then(setBoard)
		.then(setPlayers)
		.then(prepareToChooseWonders)
		.then(maybePrepareExpansion);
}

function setBoard(game: GameType): GameType {
	game.trash = [];
	// @ts-ignore
	game.sciences = utils.shuffle(Object.keys(bank.sciences));
	game.sciences = game.sciences.filter(
		(token) => game.params.godExpansion || token !== ScienceToken.mysticism
	);
	return game;
}

function setPlayers(game: GameType): GameType {
	game.players = Object.entries(store.lobby).map(
		([userId, userName], index) => ({
			userId,
			userName,
			wonders: [],
			money: 7,
			military: 0,
			index,
			militaryBonuses: { 3: 2, 6: 5, 9: 0 },
		})
	);
	if (game.players.length !== 2) throw new Error("need 2 players");
	game.wentFirst = 1 - utils.myIndex(game);
	return game;
}

function prepareToChooseWonders(game: GameType): GameType {
	game.commercials = [
		{
			commercial: CommercialEnum.chooseWonder,
			playerIndex: utils.myIndex(game),
			extra: {
				firstRound: true,
				remaining: 4,
				wonders: utils.shuffle(
					Object.keys(
						bank.wonders.filter(
							(wonder) =>
								game.params.godExpansion || !wonder.expansion
						)
					)
				),
			},
		},
	];
	return game;
}

function maybePrepareExpansion(game: GameType): GameType {
	if (game.params.godExpansion) {
		game.discounts = utils.shuffle([
			TokenType.two,
			TokenType.three,
			TokenType.four,
		]);
		game.godTokens = utils.shuffle([
			TokenType.egyptian,
			TokenType.egyptian,
			TokenType.mesopotamian,
			TokenType.mesopotamian,
			TokenType.greek,
			TokenType.greek,
			TokenType.phoenician,
			TokenType.phoenician,
			TokenType.roman,
			TokenType.roman,
		]);
	}
	return game;
}

export default NewGame;
