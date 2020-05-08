import React from "react";
import { LobbyType } from "../firegame/wrapper/C_LobbyListener";
import { InfoType } from "../firegame/wrapper/D_Base";

abstract class GameElement<T> extends React.Component<{
	sendGameState: (message: string, newState: T) => void;
	game: T;
	info: InfoType;
	userId: string;
	lobby: LobbyType;
}> {}

export default GameElement;
