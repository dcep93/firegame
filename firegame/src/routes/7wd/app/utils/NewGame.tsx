import { LobbyType } from "../../../../shared/store";

import { store, utils } from ".";
import bank, { Age, ScienceToken, God } from "./bank";

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
	discounts: number[];
	godTokens: God[];
	gods: { [g in God]: number[] };
	pantheon: number[];
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
	gods?: number[];
};

export type TokenType = {
	value: God | number;
	isGod: boolean;
};

export type CommercialType = {
	commercial: CommercialEnum;
	playerIndex: number;
	extra?: any;
};

export enum CommercialEnum {
	science = "select a science token",
	chooseWonder = "choose a wonder",
	destroyGrey = "destroy a grey card",
	destroyBrown = "destroy a brown card",
	revive = "construct a card from discard",
	library = "choose a science token",
	destroyWonder = "destroy one of your wonders",
	pickGod = "choose a god to add to the pantheon",
	unbuild = "unbuild a wonder",
	stealWonder = "steal an unbuilt wonder",
	wonderFromTrash = "use a card from the trash to build a wonder",
	destroyFromStructure = "destoy a card from the strucutre",
}

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
		game.discounts = utils.shuffle([2, 3, 4]);
		game.godTokens = utils.shuffle([
			God.egyptian,
			God.egyptian,
			God.mesopotamian,
			God.mesopotamian,
			God.greek,
			God.greek,
			God.phoenician,
			God.phoenician,
			God.roman,
			God.roman,
		]);
		const gods: { [g in God]?: number[] } = {};
		for (let source in God) {
			const god: God = God[source as God];
			gods[god] = bank.gods
				.map((g, index) => ({ g, index }))
				.filter((obj) => obj.g.source === god)
				.map((obj) => obj.index);
		}
		game.gods = gods as { [g in God]: number[] };
		game.pantheon = Array.from(new Array(6)).map(() => -1);
	}
	return game;
}

export default NewGame;
