import React from "react";
import { GameType } from "./Render";

import styles from "../../../shared/Styles.module.css";
import css from "./index.module.css";

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
				<div className={css.info}>
					<div className={css.card}>
						<p>{term.word}</p>
					</div>
					{term.image && (
						<img className={css.image} src={term.image} alt="" />
					)}
				</div>
			</div>
		);
	}
}

export default Hand;
