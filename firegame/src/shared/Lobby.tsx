import React, { FormEvent } from "react";

import Firebase from "./Firebase";

const HEARTBEAT_INTERVAL = 1000;

type GameStateType = any;

interface StateType {
	userId: string;
	username?: string;
	lobby?: LobbyType;
	game?: GameStateType;
}

interface LobbyType {
	[userId: string]: PersonType;
}

interface PersonType {
	userId: string;
	username?: string;
	timestamp: number;
	signInTime: number;
}

abstract class Lobby extends React.Component<{ roomId: number }, StateType> {
	inputRef: React.RefObject<HTMLInputElement> = React.createRef();
	abstract gameName(): string;

	abstract ensureGameHasStarted(): void;

	lobbyPath() {
		return `${this.gameName()}/lobby/${this.props.roomId}`;
	}

	mePath(userId: string) {
		return `${this.lobbyPath()}/users/${userId}`;
	}

	initLobby() {
		// todo is this necessary
		Firebase.set(`${this.lobbyPath()}/alive`, true);
		Firebase.connect(this.lobbyPath(), this.setLobby.bind(this));
	}

	getFromLobby(lobby?: LobbyType): PersonType | null {
		// todo
		return null;
		// return (lobby!.users || {})[this.state.userId];
	}

	setLobby(lobby: LobbyType) {
		this.setState({ lobby });
		const me: PersonType | null = this.getFromLobby(lobby);
		if (me && this.state.username !== me.username) {
			this.setState({ username: me.username });
			this.ensureGameHasStarted();
		}
	}

	renderLobby() {
		if (this.getFromLobby(this.state.lobby) !== undefined) {
			return <pre>{JSON.stringify(this.state.lobby, null, 2)}</pre>;
		} else {
			return (
				<form onSubmit={this.setUsername.bind(this)}>
					<input type="text" ref={this.inputRef} />
				</form>
			);
		}
	}

	setUsername(e: FormEvent<HTMLFormElement>) {
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
		setInterval(this.updateTimestamp.bind(this), HEARTBEAT_INTERVAL);
	}

	updateTimestamp() {
		Firebase.set(`${this.mePath(this.state.userId)}/timestamp`, Date.now());
	}
}

export default Lobby;
