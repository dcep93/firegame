import React from "react";

import utils, { store } from "../utils";
import { ScienceToken, CommercialEnum, ScienceEnum } from "../utils/types";

import styles from "../../../../shared/styles.module.css";

export const NUM_SCIENCES = 5;

class Science extends React.Component {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Sciences</h2>
				<div className={styles.flex}>
					{store.gameW.game.sciences
						.slice(0, NUM_SCIENCES)
						.filter((obj) => !obj.taken)
						.map((obj) => obj.token)
						.map(this.renderScience.bind(this))}
				</div>
			</div>
		);
	}

	renderScience(scienceToken: ScienceToken) {
		return (
			<div
				key={scienceToken}
				className={styles.bubble}
				title={scienceToken}
				onClick={() => this.select(scienceToken)}
			>
				{utils.enumName(scienceToken, ScienceToken)}
			</div>
		);
	}

	select(token: ScienceToken) {
		if (!utils.isMyCommercial(CommercialEnum.science)) return;
		store.gameW.game.sciences.find(
			(obj) => obj.token === token
		)!.taken = true;
		this.handleSelected(token);
		const me = utils.getMe();
		if (!me.scienceTokens) me.scienceTokens = [];
		me.scienceTokens.push(token);
		utils.endCommercial(`selected ${utils.enumName(token, ScienceToken)}`);
	}

	handleSelected(selected: ScienceToken) {
		switch (selected) {
			case ScienceToken.agriculture:
			case ScienceToken.urbanism:
				utils.getMe().money += 6;
				return;
			case ScienceToken.law:
				utils.gainScience(ScienceEnum.law);
				return;
		}
	}
}

export default Science;
