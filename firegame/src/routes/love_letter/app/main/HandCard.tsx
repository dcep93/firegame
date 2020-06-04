import React from "react";

import { Card, Ranks } from "../utils/NewGame";
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
		const me = utils.getMe();
		const played = me.hand!.splice(this.props.index, 1)[0];
		if (!me.played) me.played = [];
		me.played.unshift(played);
		switch (played) {
			case Card.princess:
				utils.discard(me);
			// @ts-ignore fallthrough
			case Card.handmaid:
			case Card.countess:
				utils.advanceTurn();
				break;
			default:
				store.gameW.game.played = played;
		}
		store.update(`played ${Card[played]}`);
	}
}

export default HandCard;
