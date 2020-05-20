import React from "react";

import utils, { store } from "../utils";

import styles from "../../../../shared/styles.module.css";
import { ScienceToken, CommercialEnum } from "../utils/types";

export const NUM_SCIENCES = 5;

class Science extends React.Component {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Sciences</h2>
				<div className={styles.flex}>
					{store.gameW.game.sciences
						.slice(0, NUM_SCIENCES)
						.map(this.renderScience.bind(this))}
				</div>
			</div>
		);
	}

	renderScience(scienceToken: ScienceToken, index: number) {
		return (
			<div
				key={scienceToken}
				className={styles.bubble}
				title={scienceToken}
				onClick={() => this.select(index)}
			>
				{ScienceToken[utils.getName(scienceToken, ScienceToken)]}
			</div>
		);
	}

	select(index: number) {
		if (
			!(
				utils.isMyTurn() &&
				(store.gameW.game.commercials || [])[0]?.commercial ===
					CommercialEnum.science
			)
		)
			return;
		const selected = store.gameW.game.sciences.splice(index, 1)[0];
		this.handleSelected(selected);
		const me = utils.getMe();
		if (!me.sciences) me.sciences = [];
		me.sciences.push(selected);
		store.gameW.game.commercials!.shift();
	}

	handleSelected(selected: ScienceToken) {
		switch (selected) {
			case ScienceToken.agriculture:
				utils.getMe().money += 6;
				return;
			case ScienceToken.urbanism:
				utils.getMe().money += 6;
				return;
		}
	}
}

export default Science;
