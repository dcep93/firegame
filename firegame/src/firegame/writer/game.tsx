import Store, { GameWrapperType } from "../../shared/store";
import Firebase from "../firebase";
import { gamePath, update } from "./utils";
type RecordType<T> = { [updateKey: string]: GameWrapperType<T> };

const GAME_EXPIRE_TIME = 2 * 60 * 60 * 1000;
function enterGame(): void {
	Firebase.latestChild(gamePath(), receiveGameUpdate);
}

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

function receiveGameUpdate<T>(record: RecordType<T>): void {
	if (record) {
		const gameWrapper = Object.values(record)[0];
		if (Firebase.now() - gameWrapper.info.timestamp < GAME_EXPIRE_TIME) {
			// todo maybe ignore the game if the host
			// of the game isnt in the lobby?
			// otherwise we'll likely see old games from that lobby
			// @ts-ignore
			Store.gameW = gameWrapper;
			update();
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

export { enterGame, sendGameState };
