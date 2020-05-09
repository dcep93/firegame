import Store, { LobbyType } from "../../shared/store";
import Firebase from "../firebase";
import { mePath, update } from "./utils";
import { enterGame } from "./game";

const PRESENT_EXPIRE = 3000;
const HEARTBEAT_INTERVAL = 1000;

type RemotePersonType = {
	userId: string;
	username: string;
	timestamp: number;
	signInTime: number;
};

function heartbeat(): void {
	setInterval(updateTimestamp, HEARTBEAT_INTERVAL);
}

function updateTimestamp(): void {
	Firebase.set(`${mePath()}/timestamp`, Firebase.now());
}

function lobbyEquals(lobby: LobbyType): boolean {
	if (!Store.lobby) return false;
	if (Object.keys(lobby).length !== Object.keys(Store.lobby).length)
		return false;
	for (let [userId, username] of Object.entries(lobby)) {
		if (Store.lobby[userId] !== username) return false;
	}
	return true;
}

function setLobbyFromRemote(remoteLobby: {
	[userId: string]: RemotePersonType;
}): void {
	const lobby: LobbyType = {};
	if (remoteLobby) {
		for (let [userId, person] of Object.entries(remoteLobby)) {
			if (Firebase.now() - person.timestamp > PRESENT_EXPIRE) continue;
			lobby[userId] = person.username;
			if (userId === Store.me.userId) signin();
		}
	}
	if (!lobbyEquals(lobby)) {
		// @ts-ignore
		Store.lobby = lobby;
		update();
	}
}

function setUsername(username: string): void {
	const userId: string = Store.me.userId;
	const now: number = Firebase.now();
	const myUserObj: RemotePersonType = {
		userId,
		username,
		timestamp: now,
		signInTime: now,
	};
	Firebase.set(`${mePath()}`, myUserObj);
}

var gameHasStarted: boolean = false;
function signin(): void {
	if (gameHasStarted) return;
	gameHasStarted = true;
	heartbeat();
	enterGame();
}

export { setUsername, setLobbyFromRemote };