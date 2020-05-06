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

class Lobby extends React.Component<{ roomId: number }, StateType> {
	inputRef: React.RefObject<HTMLInputElement> = React.createRef();
	heartbeatInterval;

	roomPath() {
		return `timeline/lobby/${this.props.roomId}`;
	}

	mePath(sessionId: string) {
		return `${this.roomPath()}/users/${sessionId}`;
	}

	initLobby() {
		Firebase.set(`${this.roomPath()}/alive`, true);
		Firebase.connect(this.roomPath(), this.setLobby.bind(this));
	}

	setLobby(lobby) {
		const updates: any = { lobby };
		const me = (lobby.users || {})[this.state.sessionId];
		if (me !== undefined) updates.username = me.username;
		this.setState(updates);
	}

	renderLobby() {
		if (this.state.lobby === undefined) {
			return "Loading...";
		} else if (
			(this.state.lobby.users || {})[this.state.sessionId] !== undefined
		) {
			if (this.heartbeatInterval === undefined) this.heartbeat();
			return <pre>{JSON.stringify(this.state.lobby, null, 2)}</pre>;
		} else {
			return (
				<form onSubmit={this.setUsername.bind(this)}>
					<input type="text" ref={this.inputRef} />
				</form>
			);
		}
	}

	setUsername(e) {
		e.preventDefault();
		const username = this.inputRef.current!.value;
		const sessionId = this.state.sessionId;
		const now = Date.now();
		const myUserObj = {
			sessionId,
			username,
			timestamp: now,
			signInTime: now,
		};
		Firebase.set(`${this.mePath(sessionId)}`, myUserObj);
	}

	heartbeat() {
		this.heartbeatInterval = setInterval(
			this.updateTimestamp.bind(this),
			HEARTBEAT_INTERVAL
		);
	}

	updateTimestamp() {
		Firebase.set(
			`${this.mePath(this.state.sessionId)}/timestamp`,
			Date.now()
		);
	}
}

export default Lobby;
