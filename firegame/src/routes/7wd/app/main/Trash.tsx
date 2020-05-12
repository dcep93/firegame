import React from "react";
import { store } from "../utils";

import styles from "../../../../shared/styles.module.css";

class Board extends React.Component<{ selected: boolean; select: () => void }> {
	render() {
		const classes = [styles.bubble];
		if (this.props.selected) classes.push(styles.grey);
		return (
			<div className={classes.join(" ")} onClick={this.props.select}>
				<h2>Trash: {store.gameW.game.trash?.length || 0}</h2>
			</div>
		);
	}
}

export default Board;
