import React from "react";
import { store } from "../utils";

import styles from "../../../../shared/styles.module.css";
import bank from "../utils/bank";

class Player extends React.Component<{
	index: number;
	selected?: number;
	select?: (index: number) => void;
}> {
	render() {
		const player = store.gameW.game.players[this.props.index];
		if (!player) return null;
		const classes = [styles.bubble];
		if (this.props.selected !== undefined) classes.push(styles.grey);
		return (
			<div>
				<div
					className={classes.join(" ")}
					onClick={() => this.props.select && this.props.select(-1)}
				>
					<h2>
						{player.userName} - ${player.money}
					</h2>
					<pre>
						{(player.cards || [])
							.map((index) => bank.cards[index].name)
							.join("\n")}
					</pre>
				</div>
			</div>
		);
	}
}

export default Player;
