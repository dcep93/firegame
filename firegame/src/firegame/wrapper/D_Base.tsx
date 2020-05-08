import React from "react";

export interface PropsType {
	component: typeof React.Component;
	name: string;
	roomId: number;
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

class WrapperBase<T> extends React.Component<PropsType> {
	constructor(props: PropsType) {
		super(props);
		this.state = {};
	}
}

export default WrapperBase;
