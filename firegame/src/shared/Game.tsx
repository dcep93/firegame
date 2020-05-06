import React from "react";

abstract class Game<T> extends React.Component<{
	sendGameState: (newState: T) => void;
	game: T;
	id: number;
}> {
	abstract buildNewGame(): T;

	componentDidMount() {
		if (!this.props.id) {
			const newGame = this.buildNewGame();
			this.props.sendGameState(newGame);
		}
	}
}

export default Game;
