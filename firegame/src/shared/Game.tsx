import React from "react";

abstract class Game<T> extends React.Component<{
	sendGameState: (newState: T) => void;
	game: T;
	id: number;
}> {
	static buildNewGame() {
		return {};
	}
}

export default Game;
