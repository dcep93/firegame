import React from "react";

import utils, { store } from "../../utils/utils";
import bank from "../../utils/bank";
import { Color, PlayerType } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class DestroyCard extends React.Component<{ color: Color }> {
	render() {
		const victim = utils.getPlayer(1 - utils.currentIndex());
		const cards = (victim.cards || [])
			.map((cardIndex, handIndex) => ({
				handIndex,
				cardIndex,
				card: bank.cards[cardIndex],
			}))
			.filter((obj) => obj.card.color === this.props.color);
		if (!cards.length) {
			utils.endCommercial(
				`could not destroy a ${Color[this.props.color]} card`
			);
			return null;
		}
		return (
			<div className={styles.bubble}>
				<h2>
					{victim.userName}'s {Color[this.props.color]} Cards
				</h2>
				<div className={styles.flex}>
					{cards.map((obj) => (
						<div
							key={obj.cardIndex}
							onClick={() =>
								this.destroyCard(obj.handIndex, victim)
							}
							className={styles.bubble}
						>
							{obj.card.name}
						</div>
					))}
				</div>
			</div>
		);
	}

	destroyCard(handIndex: number, victim: PlayerType) {
		if (!utils.isMyTurn()) return;
		const cardIndex = victim.cards!.splice(handIndex, 1)[0];
		if (!store.gameW.game.trash) store.gameW.game.trash = [];
		store.gameW.game.trash.push(cardIndex);
		utils.endCommercial(`destroyed ${bank.cards[cardIndex].name}`);
	}
}

export default DestroyCard;
