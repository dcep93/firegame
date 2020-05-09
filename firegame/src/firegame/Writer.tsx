import Store, { LobbyType, GameWrapperType, MeType } from "../shared/Store";
import Firebase from "./Firebase";

export const VERSION: string = "v0.0.3";

const PRESENT_EXPIRE = 5000;
const HEARTBEAT_INTERVAL = 1000;

const GAME_EXPIRE_TIME = 2 * 60 * 60 * 1000;

type RecordType<T> = { [updateKey: string]: GameWrapperType<T> };

// paths

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

// lobby

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

// game

function sendGameState<T>(message: string, game: T): void {
	const lastInfo = Store.gameW.info;
	const gameWrapper = {
		game,
		info: {
			id: lastInfo.id + 1,
			timestamp: Firebase.now(),
			host: lastInfo.host,
			player: Store.me.userId,
			message,
		},
	};
	sendGameStateHelper(gameWrapper);
}

function sendGameStateHelper<T>(gameWrapper: GameWrapperType<T>): void {
	Firebase.push(gamePath(), gameWrapper);
}

function enterGame(): void {
	Firebase.latestChild(gamePath(), receiveGameUpdate);
}

function receiveGameUpdate<T>(record: RecordType<T>): void {
	if (record) {
		const gameWrapper = Object.values(record)[0];
		if (Firebase.now() - gameWrapper.info.timestamp < GAME_EXPIRE_TIME) {
			// todo maybe ignore the game if the host
			// of the game isnt in the lobby?
			// otherwise we'll likely see old games from that lobby
			// @ts-ignore
			Store.gameW = gameWrapper;
			return;
		}
	}
	// this happens when remote data is deleted
	// ignore the update - our next push will update game state

	// todo test
	if (Store.gameW) return;
	const gameWrapper: GameWrapperType<T> = {
		info: {
			player: Store.me.userId,
			message: "opened a room",
			host: Store.me.userId,
			timestamp: Firebase.now(),
			id: 0,
		},
	};
	sendGameStateHelper(gameWrapper);
}

var update = function (): void {
	throw Error("this should be overwritten during init");
};

export default { init, update, setUsername, sendGameState };
