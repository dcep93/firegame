import React from "react";

import { shared } from "../utils/utils";
import { Card } from "../utils/NewGame";

import HandCard from "./HandCard";

import styles from "../../../../shared/styles.module.css";

class Hand extends React.Component {
	render() {
		const me = shared.getMe();
		return (
			<div className={styles.bubble}>
				<h2>Hand</h2>
				{me &&
					me.hand &&
					me.hand.map((card: Card, index: number) => (
						<HandCard key={index} card={card} index={index} />
					))}
			</div>
		);
	}
}

export default Hand;
