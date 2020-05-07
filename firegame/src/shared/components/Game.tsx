import React from "react";
import { LobbyType } from "../../firegame/wrapper/C_LobbyListener";

abstract class Game<T> extends React.Component<{
	sendGameState: (newState: T) => void;
	game: T;
	id: number;
	host: string;
	userId: string;
	lobby: LobbyType;
}> {}

export default Game;
