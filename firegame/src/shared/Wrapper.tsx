import React, { FormEvent } from "react";

import Firebase from "./Firebase";

import Game from "./Game";

const HEARTBEAT_INTERVAL = 1000;

type RecordType = { [updateKey: string]: GameStateType<any> };

interface LobbyType {
	[userId: string]: PersonType;
}

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
	lobby?: { [userId: string]: string };
	game?: GameStateType<T>;
}

type GameStateType<T> = { id: number; game: T };

var minUpdateKey = "";
var gameHasStarted = false;

class Wrapper<T> extends React.Component<PropsType, StateType<T>> {
	inputRef: React.RefObject<HTMLInputElement> = React.createRef();

	constructor(props: PropsType) {
		super(props);
		this.setUserId();
		this.state = { userId: localStorage.userId };
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

	// game

	renderGame() {
		return (
			<this.props.component
				sendGameState={this.sendGameState.bind(this)}
				game={this.state.game!.game}
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
		// @ts-ignore
		const game: GameState<T> = { id: 1 };
		if (!record) return this.setState({ game });
		for (let [key, value] of Object.entries(record)) {
			if (minUpdateKey <= key) this.setState({ game: value });
		}
	}

	sendGameState(gameState: T) {
		const out = {
			game: gameState,
			id: (this.state.game ? this.state.game.id : 0) + 1,
		};
		return Firebase.push(this.gamePath(), out);
	}

	// init

	setUserId() {
		if (!localStorage.userId)
			localStorage.userId = btoa(Math.random().toString());
	}

	componentDidMount() {
		Firebase.init();
		this.initLobby();
	}

	initLobby() {
		Firebase.connect(this.lobbyPath(), this.setLobby.bind(this));
	}

	// lobby

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

	lobbyEquals(lobby: { [userId: string]: string }): boolean {
		if (!this.state.lobby) return false;
		if (Object.keys(lobby).length !== Object.keys(this.state.lobby).length)
			return false;
		for (let [userId, username] of Object.entries(lobby)) {
			if (this.state.lobby[userId] !== username) return false;
		}
		return true;
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

	// paths

	gamePath() {
		return `${this.props.name}/game/${this.props.roomId}`;
	}

	lobbyPath() {
		return `${this.props.name}/lobby/${this.props.roomId}`;
	}

	mePath(userId: string) {
		return `${this.lobbyPath()}/${userId}`;
	}
}

export default Wrapper;
