import React, { RefObject } from "react";

import { store } from "../utils";
import NewGame from "../utils/NewGame";

import styles from "../../../../shared/styles.module.css";

class Players extends React.Component {
	expansionRef: RefObject<HTMLInputElement> = React.createRef();
	render() {
		return (
			<div className={styles.bubble}>
				<h1>Lobby</h1>
				{Object.keys(store.lobby).map(this.renderPlayer.bind(this))}
				<div>
					<label>
						God Expansion:{" "}
						<input type={"checkbox"} ref={this.expansionRef} />
					</label>
				</div>
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
			godExpansion: this.expansionRef.current!.checked,
			lobby: store.lobby,
		};
	}
}

export default Players;
