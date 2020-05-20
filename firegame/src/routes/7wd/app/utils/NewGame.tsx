import { store, utils } from ".";
import { Params, GameType, ScienceToken, CommercialEnum, God } from "./types";
import bank from "./bank";

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
		(token) =>
			game.params.godExpansion ||
			(token !== ScienceToken.mysticism &&
				token !== ScienceToken.polioretics &&
				token !== ScienceToken.engineering)
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
		game.godTokens = utils.shuffle(
			Object.values(God).concat(Object.values(God)) as God[]
		);
		const gods: { [g in God]?: number[] } = {};
		Object.values(God).forEach(
			(god: string | God) =>
				(gods[god as God] = bank.gods
					.map((g, index) => ({ g, index }))
					.filter((obj) => obj.g.source === god)
					.map((obj) => obj.index))
		);
		game.gods = gods as { [g in God]: number[] };
		game.pantheon = Array.from(new Array(6)).map(() => -1);
	}
	return game;
}

export default NewGame;
