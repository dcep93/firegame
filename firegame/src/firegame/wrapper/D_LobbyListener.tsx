import Firebase from "../Firebase";

import Base from "./E_Base";
import { LobbyType } from "../Lobby";

// ping every second, values expire after 5 seconds to determine disconnects

const HEARTBEAT_INTERVAL = 1000;

var gameHasStarted: boolean = false;

interface PersonType {
	userId: string;
	username: string;
	timestamp: number;
	signInTime: number;
}

abstract class LobbyListener<T> extends Base<T> {
	abstract enterGame(): void;
	componentDidMount(): void {
		Firebase.connect(this.lobbyPath(), this.setLobby.bind(this));
	}

	setUsername(username: string): void {
		const userId: string = this.state.userId;
		const now: number = Date.now();
		const myUserObj: PersonType = {
			userId,
			username,
			timestamp: now,
			signInTime: now,
		};
		Firebase.set(`${this.mePath(userId)}`, myUserObj);
	}

	signin(): void {
		if (gameHasStarted) return;
		gameHasStarted = true;
		this.heartbeat();
		this.enterGame();
	}

	setLobby(remoteLobby: { [userId: string]: PersonType }): void {
		const lobby: LobbyType = {};
		if (remoteLobby) {
			for (let [userId, person] of Object.entries(remoteLobby)) {
				lobby[userId] = person.username;
				if (userId === this.state.userId) this.signin();
			}
		}
		if (!this.lobbyEquals(lobby)) this.setState({ lobby });
	}

	lobbyEquals(lobby: LobbyType): boolean {
		if (!this.state.lobby) return false;
		if (Object.keys(lobby).length !== Object.keys(this.state.lobby).length)
			return false;
		for (let [userId, username] of Object.entries(lobby)) {
			if (this.state.lobby[userId] !== username) return false;
		}
		return true;
	}

	heartbeat(): void {
		setInterval(this.updateTimestamp.bind(this), HEARTBEAT_INTERVAL);
	}

	updateTimestamp(): void {
		Firebase.set(`${this.mePath(this.state.userId)}/timestamp`, Date.now());
	}

	lobbyPath(): string {
		return `${this.roomPath()}/lobby`;
	}

	mePath(userId: string): string {
		return `${this.lobbyPath()}/${userId}`;
	}

	roomPath(): string {
		return `${this.props.name}/${this.props.roomId}`;
	}
}

export default LobbyListener;
