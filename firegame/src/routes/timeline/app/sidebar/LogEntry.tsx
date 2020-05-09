import React from "react";
import store, { GameWrapperType } from "../../../../shared/store";
import { GameType } from "../utils/NewGame";

class LogEntry extends React.Component<{ wrapper: GameWrapperType<GameType> }> {
	render() {
		return <pre onClick={this.revert.bind(this)}>{this.getMessage()}</pre>;
	}

	getMessage() {
		const w = this.props.wrapper;
		return `(${w.info.id}) ${w.info.timestamp} [${w.info.player}] ${w.info.message}`;
	}

	revert(): void {
		const message = `restored to [${this.getMessage()}]`;
		store.update(message, this.props.wrapper.game);
	}
}

export default LogEntry;
