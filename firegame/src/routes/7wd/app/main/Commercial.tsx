import React from "react";

import { store, getWonderCost, utils, deal } from "../utils";
import { CommercialEnum } from "../utils/NewGame";

import styles from "../../../../shared/styles.module.css";
import bank, { Age } from "../utils/bank";

class Commercial extends React.Component {
	componentDidMount() {
		this.alert();
	}

	componentDidUpdate() {
		this.alert();
	}

	alert() {
		// if (utils.isMyTurn()) alert(commercials[store.gameW.game.commercial!]);
	}

	render() {
		switch (store.gameW.game.commercial) {
			case CommercialEnum.chooseWonder:
				const params = store.gameW.game.extra;
				return (
					<div className={styles.bubble}>
						<h2>Wonders</h2>
						<div className={styles.flex}>
							{Object.keys(
								Array.from(new Array(params.remaining))
							).map((index: string) => (
								<div key={index} className={styles.bubble}>
									{this.renderWonder(
										parseInt(index),
										params.wonders
									)}
								</div>
							))}
						</div>
					</div>
				);
		}
		return null;
	}

	renderWonder(index: number, wonders: number[]) {
		const wonder = bank.wonders[wonders[index]];
		return (
			<div
				title={JSON.stringify(wonder, null, 2)}
				onClick={() => this.chooseWonder(index, wonders)}
			>
				<p>{wonder.name}</p>
				<p>{wonder.message}</p>
				<div>
					cost: {wonder.cost.join("")} (${getWonderCost(wonder)})
				</div>
			</div>
		);
	}

	chooseWonder(index: number, wonders: number[]) {
		const wonderIndex = wonders.splice(index, 1)[0];
		if (!utils.getMe().wonders) utils.getMe().wonders = [];
		utils.getMe().wonders.push({ built: false, wonderIndex });
		const game = store.gameW.game;
		const params = game.extra;
		params.remaining--;
		if (params.remaining !== 2) {
			utils.incrementPlayerTurn();
			if (params.remaining === 0) {
				if (params.firstRound) {
					params.firstRound = false;
					params.remaining = 4;
				} else {
					delete store.gameW.game.extra;
					delete store.gameW.game.commercial;
					game.wentFirst = utils.myIndex();
					game.age = Age.one;
					deal(game);
				}
			}
		}
		store.update(`selected ${bank.wonders[wonderIndex].name}`);
	}
}

export default Commercial;
