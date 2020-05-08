import React from "react";

import styles from "../../../shared/Styles.module.css";
import Store from "../../../shared/Store";

class Players extends React.Component {
	render() {
		return (
			<div className={styles.bubble}>
				<h1>Players</h1>
				{Object.keys(Store.getLobby()).map(
					this.renderPlayer.bind(this)
				)}
			</div>
		);
	}

	renderPlayer(userId: string): JSX.Element {
		var prefix = "";
		if (Store.getGameW().info.host === userId) prefix += "(host) ";
		if (Store.getMe().userId === userId) prefix += "(you) ";
		return <p key={userId}>{`${prefix}${Store.getLobby()[userId]}`}</p>;
	}
}

export default Players;
