import writer from "../firegame/writer";

var store: StoreType<any>;

export type StoreType<T> = Readonly<{
	me: Readonly<MeType>;
	lobby: Readonly<LobbyType>;
	gameW: Readonly<GameWrapperType<T>>;
	update: (message: string, newGame?: T) => void;
}>;

export type MeType = {
	userId: string;
	roomId: number;
	gameName: string;
	VERSION: string;
};

export type GameWrapperType<T> = {
	info: InfoType;
	game: T;
};

export type LobbyType = { [userId: string]: string };

export type InfoType = {
	host: string;
	timestamp: number;
	id: number;
	message: string;
	playerId: string;
	playerName: string;
};

function update<T>(message: string, game_: T | undefined = undefined): void {
	const game = game_ || store.gameW.game;
	console.log(game);
	writer.sendGameState(message, game);
}

// @ts-ignore store initialization
store = { update };

export default store;
