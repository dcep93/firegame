import React from "react";

type GameType = any;

abstract class Game extends React.Component<{
	sendGameState: (newState: GameType) => void;
	game: GameType;
	id: number;
}> {}

export default Game;
