import React from "react";

import styles from "../../../../shared/css/Styles.module.css";
import { GameType } from "./Render";

class Board extends React.Component<{ game: GameType }> {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Board</h2>
				{this.getCardsAndTargets()}
			</div>
		);
	}

	getCardsAndTargets() {
		const cardsAndTargets: JSX.Element[] = [this.renderTarget(0)];
		this.props.game.board.forEach((termIndex: number, index: number) => {
			cardsAndTargets.push(this.renderCard(termIndex));
			cardsAndTargets.push(this.renderTarget(index + 1));
		});
		return cardsAndTargets;
	}

	renderTarget(index: number) {
		return <p>{index}</p>;
	}

	renderCard(termIndex: number) {
		const term = this.props.game.terms[termIndex];
		return (
			<div key={termIndex} className={styles.bubble}>
				<p>{term.word}</p>
				<p>{term.definition}</p>
				{term.image && <img src={term.image} alt="" />}
			</div>
		);
	}
}

export default Board;
