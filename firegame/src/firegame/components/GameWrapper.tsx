import React from "react";

import store from "../../shared/store";

import Writer from "../writer";

import LoadingPage from "./LoadingPage";
import LoginPage from "./LoginPage";

class GameWrapper extends React.Component<{
	component: typeof React.Component;
	gameName: string;
	roomId: number;
}> {
	componentDidMount() {
		document.title = this.props.gameName.toLocaleUpperCase();
		Writer.init(
			this.props.roomId,
			this.props.gameName,
			this.forceUpdate.bind(this)
		);
	}

	render() {
		if (store.lobby === undefined) return <LoadingPage />;
		if (store.lobby[store.me.userId] === undefined)
			return <LoginPage setUsername={Writer.setUsername} />;
		if (!store.gameW) return null;
		return <this.props.component />;
	}
}

export default GameWrapper;
