import React from "react";

import styles from "../../../shared/Styles.module.css";
import Store, { GameWrapperType } from "../../../shared/Store";
import { GameType } from "./Render";

class Log extends React.Component<
	{},
	{ history: GameWrapperType<GameType>[] }
> {
	constructor(props: {}) {
		super(props);
		this.state = { history: [] };
	}

	componentDidMount() {
		this.updateHistory();
	}

	componentDidUpdate() {
		this.updateHistory();
	}

	updateHistory() {
		const newState = Store.gameW;
		if (
			!this.state.history[0] ||
			newState.info.id !== this.state.history[0].info.id
		) {
			this.state.history.unshift(newState);
			this.setState({ history: this.state.history });
		}
	}

	render() {
		return (
			<div className={styles.bubble}>
				<h2>Log</h2>
				{this.state &&
					this.state.history.map((wrapper) => (
						<p key={wrapper.info.id}>{wrapper.info.message}</p>
					))}
			</div>
		);
	}
}

export default Log;
