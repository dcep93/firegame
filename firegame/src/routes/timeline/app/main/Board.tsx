import React from "react";

import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";
import store from "../../../../shared/store";
import { GameType } from "../utils/NewGame";

class Board extends React.Component<{
	selectTarget: (index: number) => void;
}> {
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
		const game: GameType = store.gameW.game!;
		game.board.forEach((termIndex: number, index: number) => {
			cardsAndTargets.push(this.renderCard(termIndex));
			cardsAndTargets.push(this.renderTarget(index + 1));
		});
		return cardsAndTargets;
	}

	renderTarget(index: number) {
		return (
			<div
				key={`t${index}`}
				className={`${styles.bubble} ${css.target}`}
				onClick={(e: React.MouseEvent) => this.selectTarget(index, e)}
			></div>
		);
	}

	renderCard(termIndex: number) {
		const game: GameType = store.gameW.game!;
		const term = game.terms[termIndex];
		return (
			<div key={`c${termIndex}`} className={styles.bubble}>
				<div className={css.info}>
					<div className={css.card}>
						<p>{term.word}</p>
						<p>{term.definition}</p>
					</div>
					{term.image && (
						<img className={css.image} src={term.image} alt="" />
					)}
				</div>
			</div>
		);
	}

	selectTarget(index: number, e: React.MouseEvent) {
		e.stopPropagation();
		this.props.selectTarget(index);
	}
}

export default Board;
