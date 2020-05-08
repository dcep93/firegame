import Firebase from "../Firebase";

import Base from "./D_Base";
import Store from "../../shared/StoreElement";

const PRESENT_EXPIRE = 5000;
const HEARTBEAT_INTERVAL = 1000;

var gameHasStarted: boolean = false;

export type LobbyType = { [userId: string]: string };

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
		const userId: string = this.props.userId;
		const now: number = Firebase.now();
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
				if (Firebase.now() - person.timestamp > PRESENT_EXPIRE)
					continue;
				lobby[userId] = person.username;
				if (userId === this.props.userId) this.signin();
			}
		}
		if (!this.lobbyEquals(lobby)) {
			Store.setLobby(lobby);
			this.setState({ lobby });
		}
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
		Firebase.set(
			`${this.mePath(this.props.userId)}/timestamp`,
			Firebase.now()
		);
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
