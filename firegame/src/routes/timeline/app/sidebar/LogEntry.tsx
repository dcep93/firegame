import React from "react";

import store, { GameWrapperType } from "../../../../shared/store";

import { GameType } from "../utils/NewGame";

class LogEntry extends React.Component<{
	wrapper: GameWrapperType<GameType>;
	history: GameWrapperType<GameType>[];
}> {
	render() {
		return <pre onClick={this.revert.bind(this)}>{this.getMessage()}</pre>;
	}

	getMessage() {
		const w = this.props.wrapper;
		return `(${w.info.id}) ${w.info.timestamp} [${w.info.player}] ${w.info.message}`;
	}

	revert(): void {
		const userId = store.me.userId;
		if (store.gameW.info.host !== userId) {
			for (let gameW of this.props.history) {
				if (gameW.info.id === this.props.wrapper.info.id) break;
				if (gameW.info.player !== userId) {
					alert("only the host can revert");
					return;
				}
			}
		}
		const message = `restored to [${this.getMessage()}]`;
		store.update(message, this.props.wrapper.game);
	}
}

export default LogEntry;
