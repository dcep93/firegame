import { LobbyType } from "../firegame/wrapper/C_LobbyListener";
import { GameWrapperType } from "../firegame/wrapper/D_Base";

type MeType = {};

var store: { me: MeType; lobby: LobbyType; game: GameWrapperType<any> };
// @ts-ignore
store = {};

function getLobby(): LobbyType {
	return store.lobby;
}

function setLobby(newLobby: LobbyType): void {
	store.lobby = newLobby;
}

function getGame(): GameWrapperType<any> {
	return store.game;
}

function setGame(newGame: GameWrapperType<any>): void {
	store.game = newGame;
}

export default { getLobby, setLobby, getGame, setGame };
