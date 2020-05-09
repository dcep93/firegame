import Writer from "../firegame/writer";

var store: Readonly<{
	me: Readonly<MeType>;
	lobby: Readonly<LobbyType>;
	gameW: Readonly<GameWrapperType<any>>;
	update: (message: string, newGame: any) => void;
}>;

export type MeType = {
	userId: string;
	roomId: number;
	gameName: string;
	VERSION: string;
};

export type GameWrapperType<T> = {
	info: InfoType;
	game?: T;
};

export type LobbyType = { [userId: string]: string };

export type InfoType = {
	host: string;
	timestamp: number;
	id: number;
	message: string;
	player: string;
};

function update<T>(message: string, game: T): void {
	Writer.sendGameState(message, game);
}

// @ts-ignore
store = { update };

export default store;
