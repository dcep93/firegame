import React, { FormEvent } from "react";

export type LobbyType = { [userId: string]: string };

class Lobby extends React.Component<{
	userId: string;
	lobby: LobbyType;
	setUsername: (username: string) => void;
}> {
	inputRef: React.RefObject<HTMLInputElement> = React.createRef();
	render() {
		if (this.props.lobby[this.props.userId] !== undefined) {
			return <pre>{JSON.stringify(this.props.lobby, null, 2)}</pre>;
		} else {
			return (
				<form onSubmit={this.setUsername.bind(this)}>
					<input type="text" ref={this.inputRef} />
				</form>
			);
		}
	}

	setUsername(e: FormEvent<HTMLFormElement>): void {
		e.preventDefault();
		const username: string = this.inputRef.current!.value;
		this.props.setUsername(username);
	}
}

export default Lobby;
