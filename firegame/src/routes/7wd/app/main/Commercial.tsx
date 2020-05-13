import React from "react";

import { store, getWonderCost } from "../utils";
import { CommercialEnum } from "../utils/NewGame";

import styles from "../../../../shared/styles.module.css";
import bank from "../utils/bank";

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
			<div title={JSON.stringify(wonder, null, 2)}>
				<p>{wonder.name}</p>
				<p>{wonder.message}</p>
				<div>
					cost: {wonder.cost.join("")} (${getWonderCost(wonder)})
				</div>
			</div>
		);
	}
}

export default Commercial;
