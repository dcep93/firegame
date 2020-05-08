import React from "react";

import { LobbyType } from "./C_LobbyListener";

export interface PropsType {
	component: typeof React.Component;
	name: string;
	roomId: number;
	userId: string;
}

interface StateType<T> {
	lobby?: LobbyType;
	gameWrapper?: GameWrapperType<T>;
}

export type InfoType = {
	host: string;
	timestamp: number;
	id: number;
	message: string;
	player: string;
};

export type GameWrapperType<T> = {
	info: InfoType;
	game?: T;
};

class WrapperBase<T> extends React.Component<PropsType, StateType<T>> {
	constructor(props: PropsType) {
		super(props);
		this.state = {};
	}
}

export default WrapperBase;
