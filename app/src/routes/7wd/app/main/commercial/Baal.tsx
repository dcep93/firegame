import React from "react";

import utils from "../../utils/utils";
import bank from "../../utils/bank";
import { Color } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class Baal extends React.Component {
	render() {
		const cardsToSteal = (
			utils.getPlayer(1 - utils.currentIndex()).cards || []
		)
			.map((cardIndex, handIndex) => ({
				handIndex,
				card: bank.cards[cardIndex],
			}))
			.filter(
				(obj) =>
					obj.card.color === Color.brown ||
					obj.card.color === Color.grey
			);
		if (!cardsToSteal.length) {
			utils.endCommercial("no cards to steal");
			return null;
		}
		return (
			<div className={styles.bubble}>
				<h2>Steal a brown/grey card</h2>
				<div className={styles.flex}>
					{cardsToSteal.map((obj, index) => (
						<div
							key={index}
							onClick={() => {
								if (!utils.isMyTurn()) return;
								const me = utils.getMe();
								if (!me.cards) me.cards = [];
								const cardIndex = utils
									.getOpponent()
									.cards!.splice(obj.handIndex, 1)[0];
								me.cards.push(cardIndex);
								utils.endCommercial(`stole ${obj.card.name}`);
							}}
							className={styles.bubble}
						>
							{obj.card.name}
						</div>
					))}
				</div>
			</div>
		);
	}
}

export default Baal;
