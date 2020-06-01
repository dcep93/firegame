import { LobbyType } from "../../../../shared/store";

import utils, { store } from "./utils";

export type GameType = {
	params: Params;
	currentPlayer: number;
	players: PlayerType[];
	deck: Rank[];
	played?: Rank;
};

export type Params = {
	lobby: LobbyType;
};

export type PlayerType = {
	userId: string;
	userName: string;
	hand?: Rank[];
};

export enum Rank {
	guard = 1,
	priest,
	baron,
	handmaid,
	prince,
	king,
	countess,
	princess,
}

const COUNTS = {
	[Rank.guard]: 5,
	[Rank.priest]: 2,
	[Rank.baron]: 2,
	[Rank.handmaid]: 2,
	[Rank.prince]: 2,
	[Rank.king]: 1,
	[Rank.countess]: 1,
	[Rank.princess]: 1,
};

function NewGame(params: Params): PromiseLike<GameType> {
	// @ts-ignore game being constructed
	const game: GameType = {};
	game.params = params;
	return Promise.resolve(game).then(setPlayers).then(deal);
}

function setPlayers(game: GameType): GameType {
	game.players = Object.entries(store.lobby)
		.sort((a, b) => (b[0] === store.me.userId ? 1 : -1))
		.map(([userId, userName]) => ({
			userId,
			userName,
		}));
	if (game.players.length < 2 || game.players.length > 5)
		throw new Error("need 2-5 players");
	game.currentPlayer = utils.myIndex(game);
	return game;
}

function deal(game: GameType): GameType {
	game.deck = [];
	Object.entries(COUNTS).forEach(([v, count]) => {
		for (let i = 0; i < count; i++) {
			game.deck.push(parseInt(v));
		}
	});
	utils.shuffle(game.deck).pop();
	game.players.forEach((p) => (p.hand = [game.deck.pop()!]));
	utils.getCurrent(game).hand!.push(game.deck.pop()!);
	return game;
}

export default NewGame;
