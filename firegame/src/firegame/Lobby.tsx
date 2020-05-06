import React, { FormEvent } from "react";

export type LobbyType = { [userId: string]: string };

class Lobby extends React.Component<{
	username?: string;
	lobby: LobbyType;
	setUsername: (username: string) => void;
}> {
	inputRef: React.RefObject<HTMLInputElement> = React.createRef();
	render() {
		if (this.props.username !== undefined) {
			return <pre>{JSON.stringify(this.props.lobby, null, 2)}</pre>;
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
		this.props.setUsername(username);
	}
}

export default Lobby;
