import React from "react";
import utils, { store } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";

class Clue extends React.Component<{}, { visible: boolean }> {
	inputRef: React.RefObject<HTMLInputElement> = React.createRef();
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
							Answer: <input type="number" ref={this.inputRef} />
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
					<input type="text" ref={this.inputRef} />
				</form>
			</div>
		);
	}

	giveClue(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		e.stopPropagation();
		const clue = this.inputRef.current!.value;
		store.gameW.game.clue = clue;
		store.update(`gave a clue - ${clue}`);
		return false;
	}

	answerClue(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		e.stopPropagation();
		const clue = this.inputRef.current!.value;
		store.gameW.game.clue = clue;
		store.update(`gave a clue - ${clue}`);
		return false;
	}

	toggle() {
		this.setState({ visible: !this.state.visible });
	}
}

export default Clue;
