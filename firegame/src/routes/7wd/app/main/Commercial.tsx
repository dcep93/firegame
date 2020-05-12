import React from "react";

import { store } from "../utils";
import { CommercialEnum } from "../utils/NewGame";

import styles from "../../../../shared/styles.module.css";

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
		return <div>{wonders[index]}</div>;
	}
}

export default Commercial;
