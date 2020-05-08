import React from "react";

import styles from "../../../shared/Styles.module.css";
import Store from "../../../shared/StoreElement";

type PropsType = {
	host: string;
	userId: string;
};

class PlayersWrapper extends React.Component<PropsType> {
	render() {
		return <Players {...this.props} lobby={Store.getLobby()} />;
	}
}

class Players extends React.Component<
	PropsType & {
		lobby: { [userId: string]: string };
	}
> {
	render() {
		return (
			<div className={styles.bubble}>
				<h1>Players</h1>
				{Object.keys(this.props.lobby!).map(
					this.renderPlayer.bind(this)
				)}
			</div>
		);
	}

	renderPlayer(userId: string): JSX.Element {
		var prefix = "";
		if (this.props.host === userId) prefix += "(host) ";
		if (this.props.userId === userId) prefix += "(you) ";
		return <p key={userId}>{`${prefix}${this.props.lobby![userId]}`}</p>;
	}
}

export default PlayersWrapper;
