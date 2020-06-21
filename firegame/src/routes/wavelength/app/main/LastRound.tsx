import React from "react";
import { store } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";
import Card from "./Card";

class LastRound extends React.Component {
	render() {
		const lastRound = store.gameW.game.lastRound;
		if (lastRound === undefined) return null;
		return (
			<div>
				<div className={styles.bubble}>
					<h2>Previous Round</h2>
					<Card cardW={lastRound.cardW} />
					<div>
						{lastRound.cluer} received target {lastRound.target}
					</div>
					<div>Clue: {lastRound.clue}</div>
					<div>
						{lastRound.answerer} answered {lastRound.answer}
					</div>
				</div>
			</div>
		);
	}
}

export default LastRound;
