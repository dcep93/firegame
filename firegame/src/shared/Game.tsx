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
			localStorage.userId = btoa(Math.random().toString());
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
		Firebase.latestChild(this.gamePath()).then((result) => {
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
		Firebase.connect(this.gamePath(), this.maybeUpdateGame.bind(this));
	}

	maybeUpdateGame(record) {
		console.log(record);
		if (minUpdateKey <= record.key) this.setState({ game: record.value });
	}

	sendState(state) {
		return Firebase.push(this.gamePath(), state);
	}

	gamePath() {
		return `${this.gameName()}/game/${this.props.roomId}`;
	}
}

export default Game;
