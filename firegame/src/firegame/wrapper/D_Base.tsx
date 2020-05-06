import React from "react";

import Game from "../../shared/Game";

import { LobbyType } from "../Lobby";

export interface PropsType {
	component: typeof Game;
	name: string;
	roomId: number;
	userId: string;
}

interface StateType<T> {
	lobby?: LobbyType;
	game?: GameStateType<T>;
}

export type GameStateType<T> = { id: number; game?: T };

class WrapperBase<T> extends React.Component<PropsType, StateType<T>> {}

export default WrapperBase;
