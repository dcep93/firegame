import React from "react";

import GameElement from "../../shared/components/GameElement";

import { LobbyType } from "./C_LobbyListener";

export interface PropsType {
	component: typeof GameElement;
	name: string;
	roomId: number;
	userId: string;
}

interface StateType<T> {
	lobby?: LobbyType;
	gameWrapper?: GameWrapperType<T>;
}

export type GameWrapperType<T> = {
	info: {
		host: string;
		timestamp: number;
		id: number;
	};
	game?: T;
};

class WrapperBase<T> extends React.Component<PropsType, StateType<T>> {
	constructor(props: PropsType) {
		super(props);
		this.state = {};
	}
}

export default WrapperBase;
