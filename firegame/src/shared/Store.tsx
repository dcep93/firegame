import { LobbyType } from "../firegame/wrapper/C_LobbyListener";
import { GameWrapperType } from "../firegame/wrapper/D_Base";
import Firebase from "../firegame/Firebase";

const VERSION: string = "v0.0.3";

type MeType = {
	userId: string;
	sendGameState(message: string, gameState: any): void;
};

var store: {
	me: MeType;
	lobby: LobbyType;
	gameW: GameWrapperType<any>;
};
// @ts-ignore
store = {};

function init() {
	Firebase.init();
	setUserId();
	// @ts-ignore
	store.me = {};
	store.me.userId = localStorage.userId;
}

function setUserId(): void {
	if (localStorage.version !== VERSION) {
		localStorage.version = VERSION;
		localStorage.userId = `u_${Math.random().toString(16).substr(2)}`;
	}
}

function getLobby(): LobbyType {
	return store.lobby;
}

function setLobby(newLobby: LobbyType): void {
	store.lobby = newLobby;
}

function getGameW(): GameWrapperType<any> {
	return store.gameW;
}

function setGameW(newGameW: GameWrapperType<any>): void {
	store.gameW = newGameW;
}

function getMe(): MeType {
	return store.me;
}

export default {
	VERSION,
	init,
	getLobby,
	setLobby,
	getGameW,
	setGameW,
	getMe,
};
