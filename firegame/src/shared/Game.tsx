import React from "react";
import { LobbyType } from "../firegame/Lobby";

abstract class Game<T> extends React.Component<{
	sendGameState: (newState: T) => void;
	game: T;
	id: number;
	userId: string;
	lobby: LobbyType;
}> {
	abstract buildNewGame(): T;

	componentDidMount(): void {
		if (!this.props.id) {
			const newGame = this.buildNewGame();
			this.props.sendGameState(newGame);
		}
	}
}

export default Game;
