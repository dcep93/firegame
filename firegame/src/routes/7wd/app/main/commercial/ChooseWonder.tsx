import React from "react";

import utils, { store } from "../../utils";
import bank from "../../utils/bank";
import { Age } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class ChooseWonder extends React.Component<{ extra: any }> {
	render() {
		const params = this.props.extra as {
			remaining: number;
			wonders: number[];
		};
		if (params.remaining === 0) {
			if (utils.isMyTurn()) {
				const game = store.gameW.game;
				game.age = Age.one;
				utils.deal(game);
				utils.endCommercial("started the game");
			}
			return;
		}

		return (
			<div className={styles.bubble}>
				<h2>Wonders</h2>
				<div className={styles.flex}>
					{Object.keys(Array.from(new Array(params.remaining))).map(
						(index: string) => (
							<div key={index} className={styles.bubble}>
								{this.renderWonder(
									parseInt(index),
									params.wonders
								)}
							</div>
						)
					)}
				</div>
			</div>
		);
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
					cost: {wonder.cost.join("")} (${utils.getWonderCost(wonder)}
					)
				</div>
			</div>
		);
	}

	chooseWonder(index: number, wonders: number[]) {
		if (!utils.isMyTurn()) return alert("not your turn");
		const wonderIndex = wonders.splice(index, 1)[0];
		if (!utils.getMe().wonders) utils.getMe().wonders = [];
		utils.getMe().wonders.push({ built: false, wonderIndex });
		const c = store.gameW.game.commercials![0];
		c.extra.remaining--;
		if (c.extra.remaining !== 2) {
			c.playerIndex = utils.getOpponent().index;
			if (c.extra.remaining === 0) {
				if (c.extra.firstRound) {
					c.extra.firstRound = false;
					c.extra.remaining = 4;
				}
			}
		}
		utils.addCommercial(c);
		utils.endCommercial(`selected ${bank.wonders[wonderIndex].name}`);
	}
}

export default ChooseWonder;
