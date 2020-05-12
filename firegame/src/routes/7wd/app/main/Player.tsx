import React from "react";

import bank from "../utils/bank";
import { PlayerType } from "../utils/NewGame";

import styles from "../../../../shared/styles.module.css";

class Player extends React.Component<{
	player: PlayerType;
	selected?: number;
	select?: (index: number) => void;
}> {
	render() {
		if (!this.props.player) return null;
		const classes = [styles.bubble];
		if (this.props.selected !== undefined) classes.push(styles.grey);
		return (
			<div>
				<div
					className={classes.join(" ")}
					onClick={() => this.props.select && this.props.select(-1)}
				>
					<h2>
						{this.props.player.userName} - $
						{this.props.player.money}
					</h2>
					<pre>
						{(this.props.player.cards || [])
							.map((index) => bank.cards[index].name)
							.join("\n")}
					</pre>
				</div>
			</div>
		);
	}
}

export default Player;
