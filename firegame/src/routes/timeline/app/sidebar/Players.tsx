import React from "react";

import store from "../../../../shared/store";

import styles from "../../../../shared/styles.module.css";

class Players extends React.Component {
	render() {
		return (
			<div className={styles.bubble}>
				<h1>Players</h1>
				{Object.keys(store.lobby).map(this.renderPlayer.bind(this))}
			</div>
		);
	}

	// todo
	renderPlayer(userId: string): JSX.Element {
		var prefix = "";
		if (store.gameW.info.host === userId) prefix += "(host) ";
		if (store.me.userId === userId) prefix += "(you) ";
		return <p key={userId}>{`${prefix}${store.lobby[userId]}`}</p>;
	}
}

export default Players;
