import { LobbyType } from "../../../../shared/store";

import utils, { store } from "./utils";

export type GameType = {
	params: Params;
	currentPlayer: number;
	players: PlayerType[];
};

export type Params = {
	lobby: LobbyType;
};

export type PlayerType = {
	userId: string;
	userName: string;
};

function NewGame(params: Params): PromiseLike<GameType> {
	// @ts-ignore game being constructed
	const game: GameType = {};
	game.params = params;
	return Promise.resolve(game).then(setPlayers);
}

function setPlayers(game: GameType): GameType {
	game.players = Object.entries(store.lobby).map(([userId, userName]) => ({
		userId,
		userName,
	}));
	game.currentPlayer = -1;
	return game;
}

export default NewGame;
