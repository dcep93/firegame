import { LobbyType } from "../firegame/wrapper/C_LobbyListener";
import { GameWrapperType } from "../firegame/wrapper/D_Base";

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

function setMe(newMe: MeType): void {
	store.me = newMe;
}

export default { getLobby, setLobby, getGameW, setGameW, getMe, setMe };
