import React from "react";

import store, { GameWrapperType } from "../../store";

class LogEntry<T> extends React.Component<{
	wrapper: GameWrapperType<T>;
	history: GameWrapperType<T>[];
}> {
	render() {
		return <pre onClick={this.revert.bind(this)}>{this.getMessage()}</pre>;
	}

	getMessage() {
		const w = this.props.wrapper;
		const time = new Date(w.info.timestamp).toLocaleTimeString();
		return `(${w.info.id}) [${w.info.playerName}] ${w.info.message} ${time}`;
	}

	revert(): void {
		const userId = store.me.userId;
		if (store.gameW.info.host !== userId) {
			// for (let gameW of this.props.history) {
			// if (gameW.info.id === this.props.wrapper.info.id) break;
			// if (gameW.info.playerId !== userId) {
			alert("only the host can revert");
			return;
			// }
			// }
		}
		const message = `restored to [${this.getMessage()}]`;
		store.update(message, this.props.wrapper.game);
	}
}

export default LogEntry;
