import React from "react";

import { store } from "../utils";
import NewGame, { Params } from "../utils/NewGame";

import styles from "../../../../shared/styles.module.css";

class Sidebar extends React.Component {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Sidebar</h2>
				<pre onClick={this.startNewGame.bind(this)}>
					{JSON.stringify(store.gameW.info)}
				</pre>
			</div>
		);
	}

	getParams(): Params {
		return { lobby: store.lobby };
	}

	startNewGame() {
		Promise.resolve()
			.then(this.getParams.bind(this))
			.then(NewGame)
			.then((game) => game && store.update("started a new game", game));
	}
}

export default Sidebar;
