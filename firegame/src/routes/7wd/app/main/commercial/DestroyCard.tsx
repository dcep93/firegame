import React from "react";

import utils, { store } from "../../utils";
import bank from "../../utils/bank";
import { CommercialType, Color, PlayerType } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class DestroyCard extends React.Component<{
	commercial: CommercialType;
	pop: () => void;
	color: Color;
}> {
	render() {
		const victim = store.gameW.game.players[1 - utils.getCurrent().index];
		const cards = (victim.cards || [])
			.map((cardIndex) => ({
				cardIndex,
				card: bank.cards[cardIndex],
			}))
			.filter((card) => card.card.color === this.props.color);
		if (!cards) {
			if (!utils.isMyTurn()) return;
			this.props.pop();
			store.update(`could not destroy a ${Color[this.props.color]} card`);
			return;
		}
		return (
			<div className={styles.bubble}>
				<h2>
					{victim.userName}'s {Color[this.props.color]} Cards
				</h2>
				<div className={styles.flex}>
					{cards.map((card) => (
						<div
							onClick={() =>
								this.destroyCard(card.cardIndex, victim)
							}
							className={styles.bubble}
						>
							{card.card.name}
						</div>
					))}
				</div>
			</div>
		);
	}

	destroyCard(handIndex: number, victim: PlayerType) {
		if (!utils.isMyTurn()) return alert("not your turn");
		const cardIndex = victim.cards!.splice(handIndex, 1)[0];
		this.props.pop();
		if (!store.gameW.game.trash) store.gameW.game.trash = [];
		store.gameW.game.trash.push(cardIndex);
		store.update(`destroyed ${bank.cards[cardIndex].name}`);
	}
}

export default DestroyCard;
