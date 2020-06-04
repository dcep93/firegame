import React from "react";

import { store } from "../utils/utils";
import NewGame, { Params } from "../utils/NewGame";

import Log from "./Log";
import Lobby from "./Lobby";

import styles from "../../../../shared/styles.module.css";

class Sidebar extends React.Component {
	render() {
		return (
			<div className={styles.sidebar}>
				<div className={styles.bubble}>
					<h2>Love Letter</h2>
					<button onClick={this.startNewGame.bind(this)}>
						New Game
					</button>
				</div>
				<Lobby />
				<Log />
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
			.catch((e) => alert(e))
			.then((game) => game && store.update("started a new game", game));
	}
}

export default Sidebar;
