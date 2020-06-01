import React from "react";

import { Rank } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";

class HandCard extends React.Component<{ index: number }> {
	render() {
		const card = this.getCard();
		return (
			<div className={styles.bubble} onClick={this.play.bind(this)}>
				{Rank[card]} ({card})
			</div>
		);
	}

	getCard() {
		return utils.getMe().hand![this.props.index];
	}

	play() {
		const played = utils.getMe().hand!.splice(this.props.index, 1)[0];
		switch (played) {
			case Rank.princess:
				delete utils.getMe().hand;
			// @ts-ignore fallthrough
			case Rank.handmaid:
			case Rank.countess:
				utils.advanceTurn();
				break;
			default:
				store.gameW.game.played = played;
		}
		store.update(`played ${Rank[played]}`);
	}
}

export default HandCard;
