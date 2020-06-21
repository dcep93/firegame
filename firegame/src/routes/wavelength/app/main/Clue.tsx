import React from "react";
import utils, { store } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";

class Clue extends React.Component<{}, { visible: boolean }> {
	clueRef: React.RefObject<HTMLInputElement> = React.createRef();
	answerRef: React.RefObject<HTMLInputElement> = React.createRef();
	constructor(props: {}) {
		super(props);
		this.state = { visible: false };
	}

	render() {
		const clue = store.gameW.game.clue;
		if (clue !== undefined)
			return (
				<>
					<div className={styles.bubble}>Clue: {clue}</div>
					<div className={styles.bubble}>
						<form onSubmit={this.answerClue.bind(this)}>
							Answer: <input type="number" ref={this.answerRef} />
						</form>
					</div>
				</>
			);
		const cardW = store.gameW.game.cardW;
		if (cardW === undefined || !utils.isMyTurn()) return null;
		return (
			<div className={styles.bubble}>
				<div onClick={this.toggle.bind(this)}>
					Target: {this.state.visible ? cardW.target : "?"}
				</div>
				<form onSubmit={this.giveClue.bind(this)}>
					<input type="text" ref={this.clueRef} />
				</form>
			</div>
		);
	}

	giveClue(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		e.stopPropagation();
		const clue = this.clueRef.current!.value;
		store.gameW.game.clue = clue;
		store.update(`gave a clue - ${clue}`);
		return false;
	}

	answerClue(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		e.stopPropagation();
		const answer = parseFloat(this.answerRef.current!.value);
		if (answer >= 0 && answer <= 100) {
			const target = store.gameW.game.cardW!.target;
			const distance = Math.abs(target - answer);
			const cluer = utils.getCurrent();
			var points = -Math.floor(0.5 + distance / 6);
			if (points === 0) cluer.bingos++;
			points += 4;
			if (points < 2) points = 0;
			cluer.clues++;
			cluer.points += points;
			utils.incrementPlayerTurn();
			store.gameW.game.lastRound = {
				cluer: cluer.userName,
				answerer: store.lobby[store.me.userId],
				answer,
				target,
				cardW: store.gameW.game.cardW!,
				clue: store.gameW.game.clue!,
				points,
			};
			delete store.gameW.game.cardW;
			delete store.gameW.game.clue;
			store.update(`answered: ${answer} (${target})`);
		} else {
			alert("Need to pick a target between 0 and 100");
		}
		return false;
	}

	toggle() {
		this.setState({ visible: !this.state.visible });
	}
}

export default Clue;
