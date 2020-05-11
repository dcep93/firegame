import { LobbyType } from "../../../../shared/store";

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
	return Promise.resolve(game);
}

export default NewGame;
