import React from "react";

import Game from "../../shared/components/Game";

import { LobbyType } from "./C_LobbyListener";

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

export type GameStateType<T> = {
	host: string;
	timestamp: number;
	id: number;
	game?: T;
};

class WrapperBase<T> extends React.Component<PropsType, StateType<T>> {
	constructor(props: PropsType) {
		super(props);
		this.state = {};
	}
}

export default WrapperBase;
