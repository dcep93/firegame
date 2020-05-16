import React from "react";

import { store, utils } from "../utils";
import bank, { ScienceToken } from "../utils/bank";

import styles from "../../../../shared/styles.module.css";
import { CommercialEnum } from "../utils/NewGame";

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
				title={bank.sciences[scienceToken]}
				onClick={() => this.select(index)}
			>
				{ScienceToken[scienceToken]}
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
		if (!utils.getMe().sciences) utils.getMe().sciences = [];
		utils.getMe().sciences.push(selected);
		store.gameW.game.commercials!.shift();
		utils.incrementPlayerTurn();
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
