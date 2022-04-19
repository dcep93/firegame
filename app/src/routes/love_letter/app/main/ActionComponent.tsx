import React from "react";
import { PlayerType } from "../utils/NewGame";

type ActionComponentProps = {
	finish: (m: string) => void;
	reset: () => void;
	player: PlayerType;
	index: number;
};

export default abstract class ActionComponent extends React.Component<
	ActionComponentProps
> {
	executed = false;
	componentDidMount() {
		this.executed = false;
	}
}
