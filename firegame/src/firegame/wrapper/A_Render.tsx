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
