import React from "react";

import shared from "../../../../shared";

import { store } from "../utils";
import { PlayerType } from "../utils/NewGame";

import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";

class Hand extends React.Component<{
	selectedIndex?: number;
	selectCard: (index: number) => void;
}> {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Hand</h2>
				{this.getHand()}
			</div>
		);
	}

	getHand() {
		const me = shared.getMe(store.gameW.game);
		if (!me) return null;
		// todo local utils could override shared utils with proper GameType typing
		// @ts-ignore
		const hand: number[] = me.hand;
		return hand.map(this.renderCard.bind(this));
	}

	renderCard(termIndex: number, handIndex: number) {
		const term = store.gameW.game!.terms[termIndex];
		const classes = [styles.bubble];
		if (this.props.selectedIndex === handIndex)
			classes.push(css.selectedCard);
		return (
			<div
				key={handIndex}
				className={classes.join(" ")}
				onClick={(e: React.MouseEvent) => this.selectCard(handIndex, e)}
			>
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

	selectCard(selectedIndex: number, e: React.MouseEvent): void {
		e.stopPropagation();
		this.props.selectCard(selectedIndex);
	}
}

export default Hand;
