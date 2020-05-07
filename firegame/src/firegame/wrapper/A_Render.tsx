import React from "react";

import GameListener from "./B_GameListener";

import LoadingPage from "../components/LoadingPage";
import LoginPage from "../components/LoginPage";

class Render<T> extends GameListener<T> {
	render() {
		if (this.state.lobby === undefined) return <LoadingPage />;
		if (this.state.lobby[this.props.userId] === undefined)
			return (
				<LoginPage
					name={this.props.name}
					setUsername={this.setUsername.bind(this)}
				/>
			);
		if (!this.state.game) return null;
		return (
			<this.props.component
				sendGameState={this.sendGameState.bind(this)}
				userId={this.props.userId}
				lobby={this.state.lobby!}
				game={this.state.game!.game!}
				id={this.state.game!.id}
				host={this.state.game!.host}
			/>
		);
	}
}

export default Render;
