import React from "react";

import ActionComponent from "./ActionComponent";
import utils from "../utils/utils";
import { Ranks } from "../utils/NewGame";

import styles from "../../../../shared/styles.module.css";

class Guard extends ActionComponent {
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
		if (choice === "1") {
			alert("Cannot choose 1");
			return;
		}
		if (this.executed) return;
		this.executed = true;
		this.props.reset();
		const correct = choice === Ranks[this.props.player.hand![0]].toString();
		if (correct) utils.discard(this.props.player, true);
		this.props.finish(
			`guessed ${choice} for [${this.props.player.userName}] - ${
				correct ? "correct" : "incorrect"
			}`
		);
	}
}

export default Guard;
