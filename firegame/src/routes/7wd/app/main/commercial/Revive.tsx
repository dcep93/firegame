import React from "react";

import utils, { store } from "../../utils/utils";
import bank from "../../utils/bank";

import styles from "../../../../../shared/styles.module.css";

class Revive extends React.Component {
	render() {
		if (!utils.isMyTurn()) return null;
		const cards = store.gameW.game.trash || [];
		if (!cards) {
			utils.endCommercial("could not revive a card");
			return;
		}
		return (
			<div className={styles.bubble}>
				<h2>Discarded Cards</h2>
				<div className={styles.flex}>
					{cards
						.map((cardIndex) => bank.cards[cardIndex])
						.map((card, index) => (
							<div
								title={JSON.stringify(card, null, 2)}
								onClick={() => this.reviveCard(index)}
								className={styles.bubble}
							>
								{card.name}
							</div>
						))}
				</div>
			</div>
		);
	}

	reviveCard(trashIndex: number) {
		if (!utils.isMyTurn()) return;
		const cardIndex = store.gameW.game.trash!.splice(trashIndex, 1)[0];
		const me = utils.getMe();
		if (!me.cards) me.cards = [];
		me.cards.push(cardIndex);
		const card = bank.cards[cardIndex];
		utils.handleCardGain(card, false);
		utils.endCommercial(`revived ${card.name}`);
	}
}

export default Revive;
