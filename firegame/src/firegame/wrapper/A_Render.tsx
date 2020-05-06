import React from "react";

import Lobby from "../Lobby";
import GameListener from "./B_GameListener";

class Render<T> extends GameListener<T> {
	render() {
		if (this.state.lobby === undefined) return "Loading...";
		return (
			<div>
				<Lobby
					userId={this.props.userId}
					lobby={this.state.lobby}
					setUsername={this.setUsername.bind(this)}
				/>
				{this.state.game && this.renderGame()}
			</div>
		);
	}

	renderGame(): JSX.Element {
		return (
			<this.props.component
				sendGameState={this.sendGameState.bind(this)}
				userId={this.props.userId}
				game={this.state.game!.game!}
				id={this.state.game!.id}
				lobby={this.state.lobby!}
			/>
		);
	}
}

export default Render;
