import React from "react";
import utils, { store } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";
import { Difficulty } from "../utils/NewGame";

class Clue extends React.Component<{}, { visible: boolean }> {
	inputRef: React.RefObject<HTMLInputElement> = React.createRef();
	constructor(props: {}) {
		super(props);
		this.state = { visible: false };
	}

	render() {
		const cardW = store.gameW.game.cardW;
		if (cardW === undefined || !utils.isMyTurn()) return null;
		return (
			<div className={styles.bubble}>
				<div onClick={this.toggle.bind(this)}>
					Target: {this.state.visible ? cardW.target : "?"}
				</div>
				<form onSubmit={this.submit.bind(this)}>
					<input type="text" ref={this.inputRef} />
				</form>
			</div>
		);
	}

	submit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		e.stopPropagation();
		alert(this.inputRef.current!.value);
		return false;
	}

	toggle() {
		this.setState({ visible: !this.state.visible });
	}
}

export default Clue;
