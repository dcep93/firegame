import React, { FormEvent } from "react";

import Firebase from "./Firebase";

const HEARTBEAT_INTERVAL = 1000;

type GameStateType = any;

interface StateType {
	userId: string;
	username?: string;
	lobby?: { [userId: string]: string };
	game?: GameStateType;
}

interface LobbyType {
	[userId: string]: PersonType;
}

interface PersonType {
	userId: string;
	username: string;
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
		return `${this.lobbyPath()}/${userId}`;
	}

	initLobby() {
		Firebase.connect(this.lobbyPath(), this.setLobby.bind(this));
	}

	lobbyEquals(lobby: { [userId: string]: string }): boolean {
		if (!this.state.lobby) return false;
		if (Object.keys(lobby).length !== Object.keys(this.state.lobby).length)
			return false;
		for (let [userId, username] of Object.entries(lobby)) {
			if (this.state.lobby[userId] !== username) return false;
		}
		return true;
	}

	setLobby(remoteLobby: LobbyType) {
		const lobby: { [userId: string]: string } = {};
		if (remoteLobby) {
			for (let [userId, person] of Object.entries(remoteLobby)) {
				lobby[userId] = person.username;
			}
		}
		if (!this.lobbyEquals(lobby)) this.setState({ lobby });
		const me: string | null = lobby[this.state.userId];
		if (me && this.state.username !== me) {
			this.setState({ username: me });
			this.ensureGameHasStarted();
		}
	}

	renderLobby() {
		if (this.state.username !== undefined) {
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
