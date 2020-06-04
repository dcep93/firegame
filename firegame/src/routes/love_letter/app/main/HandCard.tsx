import React from "react";

import { Card } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";

class HandCard extends React.Component<{ index: number }> {
	render() {
		const card = this.getCard();
		return (
			<div className={styles.bubble} onClick={this.play.bind(this)}>
				{utils.cardString(card)}
			</div>
		);
	}

	getCard() {
		return utils.getMe().hand![this.props.index];
	}

	play() {
		if (!utils.isMyTurn()) return;
		if (store.gameW.game.played !== undefined) return;
		const me = utils.getMe();
		if (me.hand![1 - this.props.index] === Card.countess) {
			switch (me.hand![this.props.index]) {
				case Card.prince:
				// @ts-ignore fallthrough
				case Card.king:
					alert(`need to play ${Card[Card.countess]}`);
					return;
			}
		}
		const played = me.hand!.splice(this.props.index, 1)[0];
		if (!me.played) me.played = [];
		me.played.unshift(played);
		switch (played) {
			case Card.princess:
				utils.discard(me);
			// @ts-ignore fallthrough
			case Card.handmaid:
			// @ts-ignore fallthrough
			case Card.countess:
				utils.advanceTurn();
				break;
			default:
				store.gameW.game.played = played;
		}
		store.update(`played ${utils.cardString(played)}`);
	}
}

export default HandCard;
