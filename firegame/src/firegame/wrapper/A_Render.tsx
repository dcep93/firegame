import React from "react";

import GameListener from "./B_GameListener";

import LoadingPage from "../components/LoadingPage";
import LoginPage from "../components/LoginPage";
import Store from "../../shared/Store";

class Render<T> extends GameListener<T> {
	componentDidMount() {
		document.title = this.props.name.toLocaleUpperCase();
		super.componentDidMount();
	}

	render() {
		if (this.state.lobby === undefined) return <LoadingPage />;
		if (this.state.lobby[this.props.userId] === undefined)
			return (
				<LoginPage
					name={this.props.name}
					setUsername={this.setUsername.bind(this)}
				/>
			);
		if (!this.state.gameWrapper) return null;
		Store.setMe({
			userId: this.props.userId,
			sendGameState: this.sendGameState.bind(this),
		});
		return (
			<this.props.component<T>
				sendGameState={this.sendGameState.bind(this)}
				userId={this.props.userId}
				lobby={this.state.lobby!}
				game={this.state.gameWrapper!.game!}
				info={this.state.gameWrapper!.info}
			/>
		);
	}
}

export default Render;
