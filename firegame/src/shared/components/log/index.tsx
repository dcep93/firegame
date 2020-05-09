import React from "react";

import store, { GameWrapperType, LobbyType } from "../../store";

import LogEntry from "./LogEntry";

import styles from "../../styles.module.css";

const history: GameWrapperType<any>[] = [];

abstract class Log<T> extends React.Component<
	{},
	{ history: GameWrapperType<T>[] }
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
		return (
			<div className={styles.bubble}>
				<h2>Log</h2>
				<div className={styles.dont_grow}>
					<div className={styles.log_entry_parent}>
						<div className={styles.log_entry_child}>
							{this.state.history.map((wrapper) => (
								<LogEntry
									key={wrapper.info.id}
									wrapper={wrapper}
									history={this.state.history}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Log;
