import Store, { MeType } from "../../shared/store";
import Firebase from "../firebase";
import { setLobbyFromRemote } from "./lobby";
export const VERSION: string = "v0.0.3";

function init(roomId: number, gameName: string, update_: () => void) {
	Firebase.init();
	const userId = getUserId();
	const me: MeType = {
		roomId,
		gameName,
		VERSION,
		userId,
	};
	// @ts-ignore
	Store.me = me;
	update = update_;
	Firebase.connect(lobbyPath(), setLobbyFromRemote);
}

function getUserId(): string {
	if (localStorage.version !== VERSION) {
		localStorage.version = VERSION;
		localStorage.userId = `u_${Math.random().toString(16).substr(2)}`;
	}
	return localStorage.userId;
}

var update = function (): void {
	throw Error("this should be overwritten during init");
};

function lobbyPath(): string {
	return `${roomPath()}/lobby`;
}

function mePath(): string {
	return `${lobbyPath()}/${Store.me.userId}`;
}

function roomPath(): string {
	return `${Store.me.gameName}/${Store.me.roomId}`;
}

function gamePath(): string {
	return `${roomPath()}/game`;
}

export { init, update, mePath, lobbyPath, gamePath };
