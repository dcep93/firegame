import React from "react";

import utils, { store } from "../utils/utils";
import bank from "../utils/bank";
import { Age, God, ScienceToken } from "../utils/types";

import styles from "../../../../shared/styles.module.css";

class Pantheon extends React.Component<{
	selectPantheon: (index: number) => void;
	selectedPantheon?: number;
}> {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Pantheon</h2>
				<div className={styles.flex}>
					{store.gameW.game.pantheon.map(this.renderGod.bind(this))}
				</div>
			</div>
		);
	}

	renderGod(godIndex: number, pantheonIndex: number) {
		const cost =
			3 + (utils.myIndex() === 0 ? 5 - pantheonIndex : pantheonIndex);
		const classes = [styles.bubble];
		if (pantheonIndex === this.props.selectedPantheon)
			classes.push(styles.grey);
		return (
			<div
				key={pantheonIndex}
				className={classes.join(" ")}
				onClick={() => this.props.selectPantheon(pantheonIndex)}
			>
				<div>{this.godContent(godIndex)}</div>
				<div>${cost}</div>
			</div>
		);
	}

	godContent(godIndex: number) {
		if (godIndex === -1) return null;
		const god = bank.gods[godIndex];
		if (store.gameW.game.age === Age.one) return God[god.source!];
		return (
			<div>
				<div>{god.name}</div>
				<div>{god.message}</div>
				{god.name === "enki" && (
					<div>
						{store.gameW.game
							.enki!.map((token) =>
								utils.enumName(token, ScienceToken)
							)
							.join(" ")}
					</div>
				)}
			</div>
		);
	}
}

export default Pantheon;
