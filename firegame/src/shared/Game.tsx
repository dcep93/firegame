import React from "react";

import Firebase from "./Firebase";

import Lobby from "./Lobby";

var minUpdateKey = "";
var gameHasStarted = false;

type GameStateType = any;

abstract class Game extends Lobby {
	abstract renderGame(): JSX.Element;
	abstract buildNewGame(): GameStateType;

	componentDidMount() {
		this.setUserId();
		this.state = { userId: localStorage.userId };
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
		if (gameHasStarted) return;
		gameHasStarted = true;
		this.heartbeat();
		Firebase.latestChild(this.gamePath()).then(
			(result: GameStateType | null) => {
				if (!result) {
					Promise.resolve()
						.then(this.buildNewGame.bind(this))
						.then(this.sendGameStateHelper.bind(this))
						.then(this.listenForGameUpdates.bind(this));
				} else {
					minUpdateKey = Object.keys(result)[0];
					this.listenForGameUpdates();
				}
			}
		);
	}

	listenForGameUpdates() {
		Firebase.connect(this.gamePath(), this.maybeUpdateGame.bind(this));
	}

	maybeUpdateGame(record: { [key: string]: GameStateType }) {
		for (let [key, value] of Object.entries(record)) {
			if (minUpdateKey <= key) this.setState({ game: value });
		}
	}

	sendGameState() {
		this.sendGameStateHelper(this.state.game);
	}

	sendGameStateHelper(gameState: GameStateType) {
		return Firebase.push(this.gamePath(), gameState);
	}

	gamePath() {
		return `${this.gameName()}/game/${this.props.roomId}`;
	}
}

export default Game;
