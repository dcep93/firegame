import React from "react";

// why does this render twice on every setState call
abstract class Game<T> extends React.Component<{
	sendGameState: (newState: T) => void;
	game: T;
	id: number;
}> {
	abstract buildNewGame(): T;

	componentDidMount() {
		if (!this.props.game) {
			const newGame = this.buildNewGame();
			this.props.sendGameState(newGame);
		}
	}
}

export default Game;
