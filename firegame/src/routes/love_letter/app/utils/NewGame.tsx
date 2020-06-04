import { LobbyType } from "../../../../shared/store";

import utils, { store } from "./utils";

export type GameType = {
	params: Params;
	currentPlayer: number;
	players: PlayerType[];
	deck: Card[];
	played?: Card;
	aside: Card;
};

export type Params = {
	lobby: LobbyType;
};

export type PlayerType = {
	userId: string;
	userName: string;
	hand?: Card[];
	played?: Card[];
	score: number;
};

export enum Card {
	guard,
	priest,
	baron,
	handmaid,
	prince,
	king,
	countess,
	princess,
}

const COUNTS = {
	[Card.guard]: 5,
	[Card.priest]: 2,
	[Card.baron]: 2,
	[Card.handmaid]: 2,
	[Card.prince]: 2,
	[Card.king]: 1,
	[Card.countess]: 1,
	[Card.princess]: 1,
};

export const Ranks = {
	[Card.guard]: 1,
	[Card.priest]: 2,
	[Card.baron]: 3,
	[Card.handmaid]: 4,
	[Card.prince]: 5,
	[Card.king]: 6,
	[Card.countess]: 7,
	[Card.princess]: 8,
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
			score: 0,
		}));
	if (game.players.length < 2 || game.players.length > 5)
		throw new Error("need 2-5 players");
	game.currentPlayer = utils.myIndex(game);
	return game;
}

export function deal(game: GameType): GameType {
	game.deck = [];
	Object.entries(COUNTS).forEach(([v, count]) => {
		for (let i = 0; i < count; i++) {
			game.deck.push(parseInt(v));
		}
	});
	game.aside = utils.shuffle(game.deck).pop()!;
	game.players.forEach((p) => {
		p.hand = [game.deck.pop()!];
		delete p.played;
	});
	utils.getCurrent(game).hand!.push(game.deck.pop()!);
	return game;
}

export default NewGame;
