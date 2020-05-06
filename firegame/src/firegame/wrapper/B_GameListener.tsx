import Firebase from "../Firebase";

import LobbyListener from "./C_LobbyListener";
import { GameStateType } from "./D_Base";

// games expire after 4 hours of no activity

const MAX_GAME_AGE = 4 * 60 * 60 * 1000;

type RecordType<T> = { [updateKey: string]: GameStateType<T> };

class GameListener<T> extends LobbyListener<T> {
	enterGame(): void {
		Firebase.latestChild(
			this.gamePath(),
			this.receiveGameUpdate.bind(this)
		);
	}

	receiveGameUpdate(record: RecordType<T>): void {
		if (record) {
			const game = Object.values(record)[0];
			if (Firebase.now() - game.timestamp < MAX_GAME_AGE) {
				this.setState({ game });
				return;
			}
		}
		const game: GameStateType<T> = { timestamp: Firebase.now(), id: 0 };
		return this.setState({ game });
	}

	sendGameState(gameState: T): void {
		const out = {
			game: gameState,
			id: this.state.game!.id + 1,
			timestamp: Firebase.now(),
		};
		Firebase.push(this.gamePath(), out);
	}

	gamePath(): string {
		return `${this.roomPath()}/game`;
	}
}

export default GameListener;
