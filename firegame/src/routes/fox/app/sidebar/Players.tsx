import React from "react";

import { store } from "../utils";
import NewGame from "../utils/NewGame";

import styles from "../../../../shared/styles.module.css";

class Players extends React.Component {
	render() {
		return (
			<div className={styles.bubble}>
				<h1>Players</h1>
				{Object.keys(store.lobby).map(this.renderPlayer.bind(this))}
				<button onClick={this.startNewGame.bind(this)}>New Game</button>
			</div>
		);
	}

	// todo should this be combined with info
	renderPlayer(userId: string): JSX.Element {
		var prefix = "";
		if (store.gameW.info.host === userId) prefix += "(host) ";
		if (store.me.userId === userId) prefix += "(you) ";
		return <p key={userId}>{`${prefix}${store.lobby[userId]}`}</p>;
	}

	startNewGame() {
		Promise.resolve()
			.then(() => ({
				lobby: store.lobby,
			}))
			.then(NewGame)
			.catch((e) => alert(e))
			.then((game) => game && store.update("started a new game", game));
	}
}

export default Players;
