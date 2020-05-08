import React from "react";

import styles from "../../../shared/Styles.module.css";
import css from "./index.module.css";
import Store from "../../../shared/Store";
import { GameType } from "./Render";

class Hand extends React.Component<{
	selectedIndex: number;
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
		const userId = Store.getMe().userId;
		const game: GameType = Store.getGameW().game!;
		const myIndex = game.players
			.filter((player) => player.userId === userId)
			.map((player) => player.index)[0];
		const me = game.players[myIndex];
		if (!me) return null;
		return me.hand.map(this.renderCard.bind(this));
	}

	renderCard(termIndex: number, handIndex: number) {
		const game: GameType = Store.getGameW().game!;
		const term = game.terms[termIndex];
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
