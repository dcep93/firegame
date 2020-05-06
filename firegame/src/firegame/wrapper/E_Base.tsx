import React from "react";

import Game from "../../shared/Game";

import { LobbyType } from "../Lobby";

export interface PropsType {
	component: typeof Game;
	name: string;
	roomId: number;
}

interface StateType<T> {
	userId: string;
	username?: string;
	lobby?: LobbyType;
	game?: GameStateType<T>;
}

type GameStateType<T> = { id: number; game?: T };

class WrapperBase<T> extends React.Component<PropsType, StateType<T>> {}

export default WrapperBase;
