import React from "react";

import { GameWrapperType } from "../../../../shared/store";

import { store } from "../utils";
import { GameType } from "../utils/NewGame";

import LogEntry from "./LogEntry";

import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";

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
		return (
			<div className={styles.bubble}>
				<h2>Log</h2>
				<div className={styles.dont_grow}>
					<div className={css.log_entry_parent}>
						<div className={css.log_entry_child}>
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
