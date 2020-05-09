import React from "react";
import Store from "../../shared/store";
import LoadingPage from "./LoadingPage";
import LoginPage from "./LoginPage";
import Writer from "../writer";

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
		if (Store.lobby === undefined) return <LoadingPage />;
		if (Store.lobby[Store.me.userId] === undefined)
			return <LoginPage setUsername={Writer.setUsername} />;
		if (!Store.gameW) return null;
		return <this.props.component />;
	}
}

export default GameWrapper;