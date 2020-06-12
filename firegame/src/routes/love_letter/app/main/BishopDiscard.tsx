import React from "react";

import ActionComponent from "./ActionComponent";
import utils, { store } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";

class BishopDiscard extends ActionComponent {
	render() {
		return (
			<div className={styles.bubble}>
				<div>
					You were correctly guessed by the bishop. Would you like to
					discard your hand?
				</div>
				<div>
					<button onClick={() => this.execute(true)}>Yes</button>
					<button onClick={() => this.execute(true)}>No</button>
				</div>
			</div>
		);
	}

	execute(toDiscard: boolean) {
		if (this.executed) return;
		this.executed = true;
		this.props.reset();
		const cardB = utils.getMe().hand![0];
		if (toDiscard) utils.discard(utils.getMe(), false);
		store.gameW.game.currentPlayer = store.gameW.game.bishop!;
		delete store.gameW.game.bishop;
		this.props.finish(
			toDiscard
				? `discarded ${utils.cardString(cardB)}`
				: "did not discard"
		);
	}
}

export default BishopDiscard;
