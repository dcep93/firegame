import React from "react";

import { store, shared } from "../utils";
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

	renderPlayer(userId: string): JSX.Element {
		var prefix = "";
		if (store.gameW.info.host === userId) prefix += "(host) ";
		if (store.me.userId === userId) prefix += "(you) ";
		const parts = [<p key={"name"}>{`${prefix}${store.lobby[userId]}`}</p>];
		const player =
			store.gameW.game.players[
				shared.playerIndexById(store.gameW.game, userId)
			];
		if (player) {
			parts.push(<p key={"tricks"}>tricks: {player.tricks}</p>);
			parts.push(<p key={"score"}>score: {player.score}</p>);
		}
		return (
			<div key={userId}>
				<div className={styles.bubble}>{parts}</div>
			</div>
		);
	}

	startNewGame() {
		Promise.resolve()
			.then(this.getParams.bind(this))
			.then(NewGame)
			.then((game) => game && store.update("started a new game", game));
	}

	getParams() {
		return {
			lobby: store.lobby,
		};
	}
}

export default Players;
