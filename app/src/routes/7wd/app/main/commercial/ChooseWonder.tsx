import React from "react";

import utils, { store } from "../../utils/utils";
import bank from "../../utils/bank";
import { Age } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class ChooseWonder extends React.Component {
	render() {
		const total = store.gameW.game.wondersToChoose?.length;
		const remaining = total > 4 ? total - 4 : total;

		return (
			<div className={styles.bubble}>
				<h2>Wonders</h2>
				<div className={styles.flex}>
					{Object.keys(Array.from(new Array(remaining))).map(
						this.renderWonder.bind(this)
					)}
				</div>
			</div>
		);
	}

	renderWonder(indexS: string) {
		const index = parseInt(indexS);
		const wonder = bank.wonders[store.gameW.game.wondersToChoose[index]];
		return (
			<div
				key={index}
				className={styles.bubble}
				title={JSON.stringify(wonder, null, 2)}
				onClick={() => this.chooseWonder(index)}
			>
				<p>{wonder.name}</p>
				<p>{wonder.message}</p>
				<div>cost: {wonder.cost.join("")}</div>
			</div>
		);
	}

	chooseWonder(index: number) {
		if (!utils.isMyTurn()) return;
		const game = store.gameW.game;
		const wondersToChoose = game.wondersToChoose;
		const wonderIndex = wondersToChoose.splice(index, 1)[0];
		if (!utils.getMe().wonders) utils.getMe().wonders = [];
		utils.getMe().wonders.push({ built: false, wonderIndex });
		const remaining = wondersToChoose.length;

		if (!remaining) {
			game.age = Age.one;
			utils.deal(game);
		} else {
			const playerIndex =
				Math.abs(remaining - 4) === 2
					? utils.currentIndex()
					: 1 - utils.currentIndex();
			utils.addCommercial({
				commercial: game.commercials![0].commercial,
				playerIndex,
			});
		}
		utils.endCommercial(`selected ${bank.wonders[wonderIndex].name}`);
	}
}

export default ChooseWonder;
