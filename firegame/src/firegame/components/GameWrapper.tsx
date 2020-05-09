import React from "react";
import Store from "../../shared/Store";
import LoadingPage from "./LoadingPage";
import LoginPage from "./LoginPage";
import Writer from "../Writer";

type PropsType = {
	component: typeof React.Component;
	gameName: string;
	roomId: number;
};

class GameWrapper extends React.Component<PropsType> {
	componentDidMount() {
		document.title = this.props.gameName.toLocaleUpperCase();
		Writer.init();
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
