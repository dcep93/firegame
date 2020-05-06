import React from "react";

import Firebase from "./Firebase";

import Game from "../shared/Game";

import Lobby, { LobbyType } from "./Lobby";

const VERSION = "v0.0.3";

const HEARTBEAT_INTERVAL = 1000;

type RecordType = { [updateKey: string]: GameStateType<any> };

interface PersonType {
	userId: string;
	username: string;
	timestamp: number;
	signInTime: number;
}

interface PropsType {
	component: typeof Game;
	name: string;
	roomId: number;
}

interface StateType<T> {
	userId: string;
	username?: string;
	lobby?: LobbyType;
	game?: GameStateType<T>;
}

type GameStateType<T> = { id: number; game?: T };

var minUpdateKey = "";
var gameHasStarted = false;

class Wrapper<T> extends React.Component<PropsType, StateType<T>> {
	constructor(props: PropsType) {
		super(props);
		this.setUserId();
		this.state = { userId: localStorage.userId };
	}

	render() {
		if (this.state.lobby === undefined) return "Loading...";
		return (
			<div>
				<Lobby
					username={this.state.username}
					lobby={this.state.lobby}
					setUsername={this.setUsername.bind(this)}
				/>
				{this.state.game && this.renderGame()}
			</div>
		);
	}

	// game

	renderGame() {
		return (
			<this.props.component
				sendGameState={this.sendGameState.bind(this)}
				game={this.state.game!.game!}
				id={this.state.game!.id}
			/>
		);
	}

	ensureGameHasStarted() {
		if (gameHasStarted) return;
		gameHasStarted = true;
		this.heartbeat();
		Firebase.latestChildOnce(this.gamePath()).then(
			(result: RecordType | null) => {
				if (!result) {
					this.listenForGameUpdates();
				} else {
					minUpdateKey = Object.keys(result)[0];
					this.listenForGameUpdates();
				}
			}
		);
	}

	listenForGameUpdates() {
		Firebase.latestChild(this.gamePath(), this.maybeUpdateGame.bind(this));
	}

	maybeUpdateGame(record: RecordType) {
		if (!record) {
			const game: GameStateType<T> = { id: 0 };
			return this.setState({ game });
		}
		for (let [key, value] of Object.entries(record)) {
			if (minUpdateKey <= key) this.setState({ game: value });
		}
	}

	sendGameState(gameState: T) {
		const out = {
			game: gameState,
			id: this.state.game!.id + 1,
		};
		Firebase.push(this.gamePath(), out);
	}

	// init

	setUserId() {
		if (localStorage.version !== VERSION) {
			localStorage.version = VERSION;
			localStorage.userId = `u_${Math.random().toString(16).substr(2)}`;
		}
	}

	componentDidMount() {
		Firebase.init();
		this.initLobby();
	}

	initLobby() {
		Firebase.connect(this.lobbyPath(), this.setLobby.bind(this));
	}

	// lobby

	setLobby(remoteLobby: { [userId: string]: PersonType }) {
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

	lobbyEquals(lobby: { [userId: string]: string }): boolean {
		if (!this.state.lobby) return false;
		if (Object.keys(lobby).length !== Object.keys(this.state.lobby).length)
			return false;
		for (let [userId, username] of Object.entries(lobby)) {
			if (this.state.lobby[userId] !== username) return false;
		}
		return true;
	}

	setUsername(username: string) {
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

	// paths

	roomPath() {
		return `${this.props.name}/${this.props.roomId}`;
	}

	gamePath() {
		return `${this.roomPath()}/game`;
	}

	lobbyPath() {
		return `${this.roomPath()}/lobby`;
	}

	mePath(userId: string) {
		return `${this.lobbyPath()}/${userId}`;
	}
}

export default Wrapper;
