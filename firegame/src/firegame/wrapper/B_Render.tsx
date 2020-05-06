import React from "react";

import Lobby from "../Lobby";
import GameListener from "./C_GameListener";

class WrapperRender<T> extends GameListener<T> {
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

	renderGame(): JSX.Element {
		return (
			<this.props.component
				sendGameState={this.sendGameState.bind(this)}
				myUserId={this.state.userId}
				game={this.state.game!.game!}
				id={this.state.game!.id}
			/>
		);
	}
}

export default WrapperRender;
