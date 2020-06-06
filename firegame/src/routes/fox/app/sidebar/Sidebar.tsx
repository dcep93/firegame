import React from "react";

import { store, shared } from "../utils/utils";
import NewGame, { Params } from "../utils/NewGame";

import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";

import styles from "../../../../shared/styles.module.css";

class Sidebar extends SharedSidebar<Params> {
	name = "Fox in the Forest";
	NewGame = NewGame;

	getParams(): Params {
		return {
			lobby: store.lobby,
		};
	}

	renderStartNewGame() {
		return (
			<div>
				<button onClick={this.startNewGame.bind(this)}>New Game</button>
			</div>
		);
	}

	renderPlayer(userId: string, userName: string): JSX.Element {
		var prefix = "";
		if (store.gameW.info.host === userId) prefix += "(host) ";
		if (store.me.userId === userId) prefix += "(you) ";
		const parts = [<p key={"name"}>{`${prefix}${store.lobby[userId]}`}</p>];
		const player =
			store.gameW.game?.players[shared.playerIndexById(userId)];
		if (player) {
			parts.push(<p key={"tricks"}>tricks: {player.tricks}</p>);
			parts.push(<p key={"score"}>score: {player.score}</p>);
		}
		return (
			<div key={userId} className={styles.bubble}>
				{parts}
			</div>
		);
	}
}

export default Sidebar;
