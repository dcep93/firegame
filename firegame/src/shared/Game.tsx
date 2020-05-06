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
			console.log(result);
			if (!result) {
				Promise.resolve()
					.then(this.startNewGame.bind(this))
					.then(this.sendGameState.bind(this))
					.then(this.listenForGameUpdates.bind(this));
			} else {
				minUpdateKey = Object.keys(result)[0];
				this.listenForGameUpdates();
			}
		});
	}

	listenForGameUpdates() {
		Firebase.connect(this.gamePath(), this.maybeUpdateGame.bind(this));
	}

	maybeUpdateGame(record) {
		for (let [key, value] of Object.entries(record)) {
			if (minUpdateKey <= key) this.setState({ game: value });
		}
	}

	sendGameStateHelper() {
		this.sendGameState(this.state.game);
	}

	sendGameState(gameState) {
		return Firebase.push(this.gamePath(), gameState);
	}

	gamePath() {
		return `${this.gameName()}/game/${this.props.roomId}`;
	}
}

export default Game;
