import React from "react";

import { store } from "../utils/utils";
import NewGame, { Params } from "../utils/NewGame";

import Log from "./Log";

import styles from "../../../../shared/styles.module.css";

import Firebase from "../../../../firegame/firebase";
import { mePath } from "../../../../firegame/writer/utils";

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
				<div className={styles.bubble}>
					<h2 onClick={becomeHost}>Lobby</h2>
					{Object.entries(store.lobby).map(
						([userId, player], index) => (
							<div key={index} onClick={() => kick(userId)}>
								{player}
							</div>
						)
					)}
				</div>
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

function kick(userId: string) {
	if (store.gameW.info.host !== store.me.userId) return;
	if (userId === store.me.userId) {
		alert("Can't kick yourself.");
		return;
	}
	Firebase.set(mePath(userId), {});
}

function becomeHost() {
	if (store.gameW.info.host === store.me.userId) {
		alert("You're already the host.");
		return;
	}
	const response = window.prompt("Enter the password to become the host.");
	if (response !== "danrules") {
		window.open("https://www.youtube.com/watch?v=RfiQYRn7fBg");
		return;
	}
	store.gameW.info.host = store.me.userId;
	store.update("became the host");
}

export default Sidebar;
