import Firebase from "../Firebase";

import LobbyListener from "./D_LobbyListener";

var minUpdateKey: string = "";

type RecordType = { [updateKey: string]: GameStateType<any> };
type GameStateType<T> = { id: number; game?: T };

class GameListener<T> extends LobbyListener<T> {
	enterGame(): void {
		Firebase.latestChildOnce(this.gamePath()).then(
			(result: RecordType | null) => {
				if (!result) {
					this.listenForGameUpdates();
				} else {
					minUpdateKey = Object.keys(result)[0];
					this.listenForGameUpdates();
				}
			}
		);
	}

	listenForGameUpdates(): void {
		Firebase.latestChild(this.gamePath(), this.maybeUpdateGame.bind(this));
	}

	maybeUpdateGame(record: RecordType): void {
		if (!record) {
			const game: GameStateType<T> = { id: 0 };
			return this.setState({ game });
		}
		for (let [key, value] of Object.entries(record)) {
			if (minUpdateKey <= key) this.setState({ game: value });
		}
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
