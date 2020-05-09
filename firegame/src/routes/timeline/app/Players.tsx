import React from "react";

import styles from "../../../shared/Styles.module.css";
import Store from "../../../shared/Store";

class Players extends React.Component {
	render() {
		return (
			<div className={styles.bubble}>
				<h1>Players</h1>
				{Object.keys(Store.lobby).map(this.renderPlayer.bind(this))}
			</div>
		);
	}

	renderPlayer(userId: string): JSX.Element {
		var prefix = "";
		if (Store.gameW.info.host === userId) prefix += "(host) ";
		if (Store.me.userId === userId) prefix += "(you) ";
		return <p key={userId}>{`${prefix}${Store.lobby[userId]}`}</p>;
	}
}

export default Players;
