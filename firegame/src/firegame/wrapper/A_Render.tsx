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
		const userId = localStorage.userId;
		Store.getMe().sendGameState = this.sendGameState.bind(this);
		if (this.state.lobby[userId] === undefined)
			return (
				<LoginPage
					name={this.props.name}
					setUsername={this.setUsername.bind(this)}
				/>
			);
		if (!this.state.gameWrapper) return null;
		return <this.props.component />;
	}
}

export default Render;
