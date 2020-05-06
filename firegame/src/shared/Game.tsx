import React from "react";

import Firebase from "./Firebase";

import Lobby from "./Lobby";

var minUpdateKey = "";

abstract class Game extends Lobby {
	abstract renderGame(): JSX.Element;
	abstract startNewGame();

	constructor(props) {
		super(props);
		this.setUserId();
		this.state = { userId: localStorage.userId };
	}

	componentDidMount() {
		Firebase.init();
		this.initLobby();
		this.ensureGameHasStarted();
	}

	setUserId() {
		if (!localStorage.userId)
			sessionStorage.userId = btoa(Math.random().toString());
	}

	render() {
		if (this.state.lobby === undefined) return "Loading...";
		return (
			<div>
				{this.renderLobby()}
				{this.state.game && this.renderGame()}
			</div>
		);
	}

	ensureGameHasStarted() {
		Firebase.latestChild("getgameforthisroom").then((result) => {
			if (!result) {
				Promise.resolve()
					.then(this.startNewGame.bind(this))
					.then(this.sendState.bind(this))
					.then(this.listenForGameUpdates.bind(this));
			} else {
				minUpdateKey = result.key();
				this.listenForGameUpdates();
			}
		});
	}

	listenForGameUpdates() {
		Firebase.connect(
			"getgameforthisroomchildren",
			this.maybeUpdateGame.bind(this)
		);
	}

	maybeUpdateGame(record) {
		if (minUpdateKey <= record.key) this.setState({ game: record.value });
	}

	sendState(state) {
		Firebase.push("getgameforthisroomchildren", state);
	}
}

export default Game;
