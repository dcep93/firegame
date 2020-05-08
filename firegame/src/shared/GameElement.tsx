import React from "react";
import { LobbyType } from "../firegame/wrapper/C_LobbyListener";

abstract class GameElement<T> extends React.Component<{
	sendGameState: (message: string, newState: T) => void;
	game: T;
	id: number;
	host: string;
	userId: string;
	lobby: LobbyType;
}> {}

export default GameElement;
