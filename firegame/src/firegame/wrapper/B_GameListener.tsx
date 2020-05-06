import Firebase from "../Firebase";

import LobbyListener from "./C_LobbyListener";
import { GameStateType } from "./D_Base";

// games expire after 4 hours of no activity

type RecordType<T> = { [updateKey: string]: GameStateType<T> };

class GameListener<T> extends LobbyListener<T> {
	enterGame(): void {
		Firebase.latestChild(
			this.gamePath(),
			this.receiveGameUpdate.bind(this)
		);
	}

	receiveGameUpdate(record: RecordType<T>): void {
		if (!record) {
			const game: GameStateType<T> = { id: 0 };
			return this.setState({ game });
		}
		const value = Object.values(record)[0];
		this.setState({ game: value });
	}

	sendGameState(gameState: T): void {
		const out = {
			game: gameState,
			id: this.state.game!.id + 1,
		};
		Firebase.push(this.gamePath(), out);
	}

	gamePath(): string {
		return `${this.roomPath()}/game`;
	}
}

export default GameListener;
