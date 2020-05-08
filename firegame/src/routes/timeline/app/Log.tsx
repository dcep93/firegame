import React from "react";

import styles from "../../../shared/Styles.module.css";
import { GameWrapperType } from "../../../firegame/wrapper/D_Base";

class Log<T> extends React.Component<
	GameWrapperType<T>,
	{ history: GameWrapperType<T>[] }
> {
	constructor(props: GameWrapperType<T>) {
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
		if (
			!this.state.history[0] ||
			this.props.info.id !== this.state.history[0].info.id
		) {
			this.state.history.unshift(this.props);
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
