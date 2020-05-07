import React from "react";

import styles from "../../../../shared/css/Styles.module.css";
import { GameType } from "./Render";

class Board extends React.Component<{ game: GameType }> {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Board</h2>
				{this.props.game.board.map(this.renderCard.bind(this))}
			</div>
		);
	}

	renderCard(index: number) {
		const term = this.props.game.terms[index];
		return (
			<div key={index} className={styles.bubble}>
				<p>{term.word}</p>
				<p>{term.definition}</p>
				{term.image && <img src={term.image} alt="" />}
			</div>
		);
	}
}

export default Board;
