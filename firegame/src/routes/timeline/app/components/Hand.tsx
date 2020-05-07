import React from "react";
import { GameType } from "./Render";

import styles from "../../../../shared/css/Styles.module.css";

class Hand extends React.Component<{ game: GameType; myIndex: number }> {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Hand</h2>
				{this.getHand()}
			</div>
		);
	}

	getHand() {
		const me = this.props.game.players[this.props.myIndex];
		if (!me) return null;
		return me.hand.map(this.renderCard.bind(this));
	}

	renderCard(index: number) {
		const term = this.props.game.terms[index];
		return (
			<div key={index} className={styles.bubble}>
				<p>{term.word}</p>
				{term.image && <img src={term.image} alt="" />}
			</div>
		);
	}
}

export default Hand;
