import React from "react";

import ActionComponent from "./ActionComponent";
import utils, { store } from "../utils/utils";
import { Ranks } from "../utils/NewGame";

import styles from "../../../../shared/styles.module.css";

class Bishop extends ActionComponent {
	inputRef: React.RefObject<HTMLInputElement> = React.createRef();
	render() {
		return (
			<form className={styles.bubble} onSubmit={this.execute.bind(this)}>
				Choose a rank for {this.props.player.userName}: <br />
				<input ref={this.inputRef} />
			</form>
		);
	}

	execute(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		e.stopPropagation();
		this.executeHelper();
		return false;
	}

	executeHelper() {
		const choice = this.inputRef.current!.value;
		if (this.executed) return;
		this.executed = true;
		this.props.reset();
		const correct = choice === Ranks[this.props.player.hand![0]].toString();
		const msgB = `guessed ${choice} for [${this.props.player.userName}] - ${
			correct ? "correct" : "incorrect"
		}`;
		if (correct) {
			utils.getMe().score++;
			store.gameW.game.bishop = utils.myIndex();
			store.gameW.game.currentPlayer = this.props.index;
			store.update(msgB);
		} else {
			this.props.finish(msgB);
		}
	}
}

export default Bishop;
