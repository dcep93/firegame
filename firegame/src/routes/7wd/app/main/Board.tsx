import React from "react";
import { store } from "../utils";

import styles from "../../../../shared/styles.module.css";

class Board extends React.Component<{ selected: boolean; select: () => void }> {
	render() {
		const classes = [styles.bubble];
		if (this.props.selected) classes.push(styles.grey);
		return (
			<div className={classes.join(" ")} onClick={this.props.select}>
				<h2>Board</h2>
				<div>Military: {store.gameW.game.military}</div>
				<div>Trash: {store.gameW.game.trash?.length || 0}</div>
			</div>
		);
	}
}

export default Board;
