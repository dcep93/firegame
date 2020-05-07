import Firebase from "../Firebase";

import LobbyListener from "./C_LobbyListener";
import { GameStateType } from "./D_Base";

const GAME_EXPIRE_TIME = 2 * 60 * 60 * 1000;

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
			if (Firebase.now() - game.timestamp < GAME_EXPIRE_TIME) {
				this.setState({ game });
				return;
			}
		}
		// this happens when remote data is deleted
		// ignore the update - our next push will update game state
		if (this.state.game) return;
		const game: GameStateType<T> = {
			host: this.props.userId,
			timestamp: Firebase.now(),
			id: 0,
		};
		this.sendGameStateHelper(game);
	}

	sendGameState(gameState: T): void {
		const game = {
			game: gameState,
			id: this.state.game!.id + 1,
			timestamp: Firebase.now(),
			host: this.state.game!.host,
		};
		this.sendGameStateHelper(game);
	}

	sendGameStateHelper(game: GameStateType<T>): void {
		Firebase.push(this.gamePath(), game);
	}

	gamePath(): string {
		return `${this.roomPath()}/game`;
	}
}

export default GameListener;
