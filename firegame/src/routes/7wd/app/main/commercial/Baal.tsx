import React from "react";

import utils, { store } from "../../utils";
import bank from "../../utils/bank";
import { CommercialType, Color } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class Baal extends React.Component<{
	commercial: CommercialType;
	pop: () => void;
}> {
	render() {
		const cardsToSteal = utils
			.getOpponent()
			.cards?.map((cardIndex, handIndex) => ({
				handIndex,
				card: bank.cards[cardIndex],
			}))
			?.filter(
				(obj) =>
					obj.card.color === Color.brown ||
					obj.card.color === Color.grey
			);
		if (!cardsToSteal) {
			if (utils.isMyTurn()) {
				this.props.pop();
				store.update("no cards to steal");
			}
			return;
		}
		return (
			<div className={styles.bubble}>
				<h2>Steal a brown/grey card</h2>
				<div className={styles.flex}>
					{cardsToSteal.map((obj) => (
						<div
							onClick={() => {
								const me = utils.getMe();
								if (!me.cards) me.cards = [];
								me.cards.push(
									utils
										.getOpponent()
										.cards!.splice(obj.handIndex, 1)[0]
								);
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
