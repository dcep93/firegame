import React from "react";

import { store } from "../utils";
import NewGame from "../utils/NewGame";

import styles from "../../../../shared/styles.module.css";

class Players extends React.Component {
	render() {
		return (
			<div className={styles.bubble}>
				<h1>Lobby</h1>
				{Object.keys(store.lobby).map(this.renderPlayer.bind(this))}
				<button onClick={this.startNewGame.bind(this)}>New Game</button>
			</div>
		);
	}

	renderPlayer(userId: string): JSX.Element {
		var prefix = "";
		if (store.gameW.info.host === userId) prefix += "(host) ";
		if (store.me.userId === userId) prefix += "(you) ";
		return (
			<div key={userId}>
				<p>{`${prefix}${store.lobby[userId]}`}</p>
			</div>
		);
	}

	startNewGame() {
		Promise.resolve()
			.then(this.getParams.bind(this))
			.then(NewGame)
			.catch((e) => {
				alert(e);
				console.error(e);
			})
			.then((game) => game && store.update("started a new game", game));
	}

	getParams() {
		return {
			// todo allow
			godExpansion: true,
			lobby: store.lobby,
		};
	}
}

export default Players;
