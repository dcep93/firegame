import React from "react";

import { store } from "../utils";
import { Card } from "../utils/NewGame";

import playCard from "./playCard";

import styles from "../../../../shared/styles.module.css";

class HandCard extends React.Component<{ card: Card; index: number }> {
	render() {
		return (
			<div className={styles.bubble} onClick={this.play.bind(this)}>
				{this.props.card.suit}/{this.props.card.value}
			</div>
		);
	}

	play() {
		const message = playCard(this.props.index);
		if (message) store.update(message, store.gameW.game);
	}
}

export default HandCard;
