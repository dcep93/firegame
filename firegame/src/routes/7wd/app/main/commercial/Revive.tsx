import React from "react";

import utils, { store } from "../../utils";
import bank from "../../utils/bank";
import { CommercialType } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class Revive extends React.Component<{
	commercial: CommercialType;
	pop: () => void;
}> {
	render() {
		const cards = store.gameW.game.trash || [];
		if (!cards) {
			if (!utils.isMyTurn()) return;
			this.props.pop();
			store.update("could not revive a card");
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
		if (!utils.isMyTurn()) return alert("not your turn");
		const cardIndex = store.gameW.game.trash!.splice(trashIndex, 1)[0];
		this.props.pop();
		const me = utils.getMe();
		if (!me.cards) me.cards = [];
		me.cards.push(cardIndex);
		store.update(`revived ${bank.cards[cardIndex].name}`);
	}
}

export default Revive;
