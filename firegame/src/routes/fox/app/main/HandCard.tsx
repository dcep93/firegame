import React from "react";

import { store, getText } from "../utils/utils";
import { Card } from "../utils/NewGame";

import playCard from "./playCard";

import styles from "../../../../shared/styles.module.css";

class HandCard extends React.Component<{ card: Card; index: number }> {
	render() {
		return (
			<div className={styles.bubble} onClick={this.play.bind(this)}>
				{getText(this.props.card)}
			</div>
		);
	}

	play() {
		const message = playCard(this.props.index);
		if (message) store.update(message);
	}
}

export default HandCard;
