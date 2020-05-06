import React from "react";

import Firebase from "./Firebase";

import Lobby from "./Lobby";

abstract class Game extends Lobby {
	abstract renderGame(): JSX.Element;

	constructor(props) {
		super(props);
		this.setSessionId();
		this.state = { sessionId: sessionStorage.sessionId };
	}

	componentDidMount() {
		Firebase.init();
		this.initLobby();
	}

	setSessionId() {
		if (!sessionStorage.sessionId)
			sessionStorage.sessionId = btoa(Math.random().toString());
	}

	render() {
		return (
			<div>
				{this.renderLobby()}
				{this.renderGame()}
			</div>
		);
	}
}

export default Game;
