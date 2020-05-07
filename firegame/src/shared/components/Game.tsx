import React from "react";
import { LobbyType } from "../../firegame/wrapper/C_LobbyListener";

abstract class Game<T> extends React.Component<{
	sendGameState: (newState: T) => void;
	game: T;
	id: number;
	userId: string;
	lobby: LobbyType;
}> {
	abstract buildNewGame(): Promise<T> | T;

	componentDidMount(): void {
		if (!this.props.id) {
			Promise.resolve()
				.then(this.buildNewGame.bind(this))
				.then(this.props.sendGameState.bind(this));
		}
	}
}

export default Game;
