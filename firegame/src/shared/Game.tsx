import React from "react";

import Firebase from "./Firebase";

import Lobby from "./Lobby";

abstract class Game extends Lobby {
	abstract renderGame(): JSX.Element;

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
			sessionStorage.userId = btoa(Math.random().toString());
	}

	render() {
		if (this.state.lobby === undefined) return "Loading...";
		return (
			<div>
				{this.renderLobby()}
				{this.renderGame()}
			</div>
		);
	}
}

export default Game;
