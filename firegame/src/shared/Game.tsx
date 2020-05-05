import React from "react";

interface StateType {
	username?: string;
}

abstract class Game extends React.Component<{ roomId: number }, StateType> {
	state: StateType = {};
}

export default Game;
