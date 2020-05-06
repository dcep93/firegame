import React from "react";

import Firebase from "./Firebase";

const HEARTBEAT_INTERVAL = 1000;

interface StateType {
	userId: string;
	username?: string;
	lobby?: {
		[userId: string]: {
			userId: string;
			username?: string;
			timestamp: number;
			signInTime: number;
		};
	};
	game?: any;
}

abstract class Lobby extends React.Component<{ roomId: number }, StateType> {
	inputRef: React.RefObject<HTMLInputElement> = React.createRef();
	heartbeatInterval;
	abstract gameName(): string;

	lobbyPath() {
		return `${this.gameName()}/lobby/${this.props.roomId}`;
	}

	mePath(userId: string) {
		return `${this.lobbyPath()}/users/${userId}`;
	}

	initLobby() {
		Firebase.set(`${this.lobbyPath()}/alive`, true);
		Firebase.connect(this.lobbyPath(), this.setLobby.bind(this));
	}

	setLobby(lobby) {
		const updates: any = { lobby };
		const me = (lobby.users || {})[this.state.userId];
		if (me !== undefined) updates.username = me.username;
		this.setState(updates);
	}

	renderLobby() {
		if ((this.state.lobby!.users || {})[this.state.userId] !== undefined) {
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
		const userId = this.state.userId;
		const now = Date.now();
		const myUserObj = {
			userId,
			username,
			timestamp: now,
			signInTime: now,
		};
		Firebase.set(`${this.mePath(userId)}`, myUserObj);
	}

	heartbeat() {
		this.heartbeatInterval = setInterval(
			this.updateTimestamp.bind(this),
			HEARTBEAT_INTERVAL
		);
	}

	updateTimestamp() {
		Firebase.set(`${this.mePath(this.state.userId)}/timestamp`, Date.now());
	}
}

export default Lobby;
