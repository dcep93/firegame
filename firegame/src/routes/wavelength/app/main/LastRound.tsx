import React from "react";
import { store } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";
import { Difficulty } from "../utils/NewGame";

class LastRound extends React.Component {
	render() {
		const cardW = store.gameW.game.cardW;
		if (cardW === undefined) return null;
		return (
			<div>
				<div className={styles.bubble}>
					<div>Level: {Difficulty[cardW.difficulty]}</div>
					<div>
						{cardW.card.a} -> {cardW.card.b}
					</div>
				</div>
			</div>
		);
	}
}

export default LastRound;
