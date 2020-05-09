import React from "react";

import shared from "../../../../shared";

import { store } from "../utils";
import { Card } from "../utils/NewGame";

import HandCard from "./HandCard";

import styles from "../../../../shared/styles.module.css";

class Hand extends React.Component {
	render() {
		const g = shared.getMe(store.gameW.game);
		// todo
		// @ts-ignore
		const me: PlayerType = g;
		return (
			<div className={styles.bubble}>
				<h2>Hand</h2>
				{me.hand.map((card: Card, index: number) => (
					<HandCard key={index} card={card} index={index} />
				))}
			</div>
		);
	}
}

export default Hand;
