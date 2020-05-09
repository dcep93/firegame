import store, { GameWrapperType } from "../../shared/store";

import Firebase from "../firebase";

import { gamePath, update } from "./utils";

const GAME_EXPIRE_TIME = 2 * 60 * 60 * 1000;

type RecordType<T> = { [updateKey: string]: GameWrapperType<T> };

function enterGame(): void {
	Firebase.latestChild(gamePath(), receiveGameUpdate);
}

function sendGameState<T>(message: string, game: T): void {
	const lastInfo = store.gameW.info;
	const gameWrapper = {
		game,
		info: {
			id: lastInfo.id + 1,
			timestamp: Firebase.now(),
			host: lastInfo.host,
			playerId: store.me.userId,
			playerName: store.lobby[store.me.userId],
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
			// @ts-ignore read only
			store.gameW = gameWrapper;
			update();
			return;
		}
	}
	if (store.gameW) return;
	const gameWrapper: GameWrapperType<T | null> = {
		info: {
			playerId: store.me.userId,
			playerName: store.lobby[store.me.userId],
			message: "opened a room",
			host: store.me.userId,
			timestamp: Firebase.now(),
			id: 0,
		},
		game: null,
	};
	sendGameStateHelper(gameWrapper);
}

export { enterGame, sendGameState };
