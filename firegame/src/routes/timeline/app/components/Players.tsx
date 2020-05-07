import React from "react";

import styles from "../../../../shared/css/Styles.module.css";

class Players extends React.Component<{
	lobby: { [userId: string]: string };
	host: string;
	userId: string;
}> {
	render() {
		return (
			<div className={styles.bubble}>
				<h1>Players</h1>
				{Object.keys(this.props.lobby).map(
					this.renderPlayer.bind(this)
				)}
			</div>
		);
	}

	renderPlayer(userId: string): JSX.Element {
		var prefix = "";
		if (this.props.host === userId) prefix += "(host) ";
		if (this.props.userId === userId) prefix += "(you) ";
		return <p key={userId}>{`${prefix}${this.props.lobby[userId]}`}</p>;
	}
}

export default Players;
