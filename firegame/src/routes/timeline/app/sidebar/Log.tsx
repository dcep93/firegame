import React from "react";

import store, { GameWrapperType } from "../../../../shared/store";

import { GameType } from "../utils/NewGame";

import LogEntry from "./LogEntry";

import styles from "../../../../shared/styles.module.css";

const history: GameWrapperType<GameType>[] = [];

class Log extends React.Component<
	{},
	{ history: GameWrapperType<GameType>[] }
> {
	constructor(props: {}) {
		super(props);
		this.state = { history };
	}

	componentDidMount() {
		this.updateHistory();
	}

	componentDidUpdate() {
		this.updateHistory();
	}

	updateHistory() {
		const newState = store.gameW;
		if (
			!this.state.history[0] ||
			newState.info.id !== this.state.history[0].info.id
		) {
			this.state.history.unshift(JSON.parse(JSON.stringify(newState)));
			this.setState({});
		}
	}

	render() {
		// todo css help
		return (
			<div className={styles.bubble}>
				<h2>Log</h2>
				<div className={styles.dont_grow}>
					<div>
						{this.state.history.map((wrapper) => (
							<LogEntry key={wrapper.info.id} wrapper={wrapper} />
						))}
					</div>
				</div>
			</div>
		);
	}
}

export default Log;
