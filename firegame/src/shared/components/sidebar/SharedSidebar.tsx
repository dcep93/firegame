import React from "react";

import store from "../../store";

import { mePath } from "../../../firegame/writer/utils";
import Firebase from "../../../firegame/firebase";
import SharedLog from "./SharedLog";

import styles from "../../../shared/styles.module.css";

abstract class SharedSidebar<T> extends React.Component {
	abstract name: string;
	abstract NewGame: (params: T) => any;
	abstract renderStartNewGame(): JSX.Element;
	abstract getParams(): T;
	render() {
		return (
			<div className={styles.sidebar}>
				<div className={styles.bubble}>
					<h2>{this.name}</h2>
					<div>{this.renderStartNewGame()}</div>
				</div>
				<div className={styles.bubble}>
					<h2 onClick={becomeHost}>Lobby</h2>
					{Object.entries(store.lobby).map(
						([userId, userName], index) => (
							<div key={index} onClick={() => kick(userId)}>
								{this.renderPlayer(userId, userName)}
							</div>
						)
					)}
				</div>
				<SharedLog />
				<div className={styles.bubble}>
					<h2>
						<a href={".."}>Home</a>
					</h2>
				</div>
			</div>
		);
	}

	renderPlayer(userId: string, userName: string): JSX.Element {
		return <>{userName}</>;
	}

	startNewGame() {
		Promise.resolve()
			.then(this.getParams.bind(this))
			.then(this.NewGame)
			.catch((e) => {
				alert(e);
				console.error(e);
			})
			.then((game) => game && store.update("started a new game", game));
	}

	componentDidMount() {
		this.maybeSyncParams();
	}

	componentDidUpdate() {
		this.maybeSyncParams();
	}

	maybeSyncParams() {}
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
	if (!response) return;
	if (response !== "danrules") {
		window.open("https://www.youtube.com/watch?v=RfiQYRn7fBg");
		return;
	}
	store.gameW.info.host = store.me.userId;
	store.update("became the host");
}

export default SharedSidebar;
