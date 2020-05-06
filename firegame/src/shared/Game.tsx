import React from "react";

// why does this render twice on every setState call
abstract class Game<T> extends React.Component<{
	sendGameState: (newState: T) => void;
	game: T;
	id: number;
}> {
	// would be nice if this could be
	// an abstract static method
	static buildNewGame() {
		return {};
	}
}

export default Game;
