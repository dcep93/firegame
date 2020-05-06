import React from "react";

import Firebase from "./Firebase";

const HEARTBEAT_INTERVAL = 1000;

interface StateType {
	sessionId: string;
	username?: string;
	lobby?: {
		[sessionId: string]: {
			sessionId: string;
			username?: string;
			timestamp: number;
			signInTime: number;
		};
	};
}

abstract class Game extends React.Component<{ roomId: number }, StateType> {
	inputRef: React.RefObject<HTMLInputElement> = React.createRef();
	inputForm = (
		<form onSubmit={this.setUsername.bind(this)}>
			<input type="text" ref={this.inputRef} />
		</form>
	);

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

	setUsername(e) {
		e.preventDefault();
		const username = this.inputRef.current!.value;
		const sessionId = this.state.sessionId;
		const now = Date.now();
		const myUserObj = {
			[sessionId]: {
				sessionId,
				username,
				timestamp: now,
				signInTime: now,
			},
		};
		Firebase.set(
			`lobby/${this.props.roomId}/${sessionId}`,
			myUserObj
		).then(() => this.setState({ username }));
	}

	initLobby() {
		Firebase.connect(
			`lobby/${this.props.roomId}`,
			this.setLobby.bind(this)
		);
	}

	setLobby(lobby) {
		this.setState({ lobby });
	}

	renderLobby() {
		if (this.state.lobby === undefined) {
			return "Loading...";
		} else if (this.state.lobby[this.state.sessionId] !== undefined) {
			this.heartbeat();
			return <pre>{JSON.stringify(this.state.lobby)}</pre>;
		} else {
			return this.inputForm;
		}
	}

	heartbeat() {
		setInterval(this.updateTimestamp, HEARTBEAT_INTERVAL);
	}

	updateTimestamp() {
		Firebase.set(
			`lobby/${this.props.roomId}/${this.state.sessionId}/timestamp`,
			Date.now()
		);
	}
}

export default Game;
