import Firebase from "../Firebase";

import LobbyListener from "./C_LobbyListener";
import { GameWrapperType } from "./D_Base";
import Store from "../../shared/Store";

const GAME_EXPIRE_TIME = 2 * 60 * 60 * 1000;

type RecordType<T> = { [updateKey: string]: GameWrapperType<T> };

class GameListener<T> extends LobbyListener<T> {
	enterGame(): void {
		Firebase.latestChild(
			this.gamePath(),
			this.receiveGameUpdate.bind(this)
		);
	}

	receiveGameUpdate(record: RecordType<T>): void {
		if (record) {
			const gameWrapper = Object.values(record)[0];
			if (
				Firebase.now() - gameWrapper.info.timestamp <
				GAME_EXPIRE_TIME
			) {
				// todo maybe ignore the game if the host
				// of the game isnt in the lobby?
				Store.setGameW(gameWrapper);
				// trigger rerender
				this.setState({});
				return;
			}
		}
		// this happens when remote data is deleted
		// ignore the update - our next push will update game state

		// todo test
		if (Store.getGameW()) return;
		const gameWrapper: GameWrapperType<T> = {
			info: {
				player: Store.getMe().userId,
				message: "opened a room",
				host: Store.getMe().userId,
				timestamp: Firebase.now(),
				id: 0,
			},
		};
		this.sendGameStateHelper(gameWrapper);
	}

	sendGameState(message: string, game: T): void {
		const lastInfo = Store.getGameW().info;
		const gameWrapper = {
			game,
			info: {
				id: lastInfo.id + 1,
				timestamp: Firebase.now(),
				host: lastInfo.host,
				player: Store.getMe().userId,
				message,
			},
		};
		this.sendGameStateHelper(gameWrapper);
	}

	sendGameStateHelper(gameWrapper: GameWrapperType<T>): void {
		Firebase.push(this.gamePath(), gameWrapper);
	}

	gamePath(): string {
		return `${this.roomPath()}/game`;
	}
}

export default GameListener;
