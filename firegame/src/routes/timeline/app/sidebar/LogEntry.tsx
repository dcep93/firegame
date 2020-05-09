import React from "react";

import { GameWrapperType } from "../../../../shared/store";

import { store } from "../utils";
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
		const time = new Date(w.info.timestamp).toLocaleTimeString();
		const player = w.game.params.lobby[w.info.player];
		return `(${w.info.id}) ${time} [${player}] ${w.info.message}`;
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
