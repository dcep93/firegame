import React from "react";
import { GameType } from "./Render";

import styles from "../../../shared/Styles.module.css";
import css from "./index.module.css";

class Hand extends React.Component<
	{ game: GameType; myIndex: number },
	{ selectedIndex: number }
> {
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

	renderCard(termIndex: number, handIndex: number) {
		const term = this.props.game.terms[termIndex];
		const classes = [styles.bubble];
		if (this.state && this.state.selectedIndex === handIndex)
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
		if (this.state && this.state.selectedIndex === selectedIndex)
			selectedIndex = -1;
		this.setState({ selectedIndex });
	}
}

export default Hand;
