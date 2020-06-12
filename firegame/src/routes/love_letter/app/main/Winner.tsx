import React from "react";

import ActionComponent from "./ActionComponent";
import utils, { store } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";
import { deal } from "../utils/NewGame";

class Winner extends ActionComponent {
	inputRef: React.RefObject<HTMLInputElement> = React.createRef();
	render() {
		return (
			<form className={styles.bubble} onSubmit={this.execute.bind(this)}>
				What do you do on your date?
				<br />
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
		const rawMsg = this.inputRef.current!.value;
		if (this.executed) return;
		this.executed = true;
		this.props.reset();
		delete store.gameW.game.played;
		const ranks = store.gameW.game.players
			.filter((p) => p.hand)
			.map((p) => `${p.userName}: ${utils.cardString(p.hand![0])}`)
			.join(", ");
		const msg = `{${ranks}} ${rawMsg || "has a boring date"}`;
		deal(store.gameW.game);
		store.gameW.info.alert = msg;
		utils.getMe().score++;
		store.update(msg);
	}
}

export default Winner;
