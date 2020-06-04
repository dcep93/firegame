import React from "react";

import utils, { store } from "../utils/utils";
import { Card, deal, Ranks } from "../utils/NewGame";

import styles from "../../../../shared/styles.module.css";

var actioning = false;

class Action extends React.Component {
	componentDidMount() {
		this.action();
	}

	componentDidUpdate() {
		this.action();
	}

	action() {
		if (!utils.isMyTurn() || actioning) return;
		actioning = true;
		if (store.gameW.game.played === null) {
			const msg = `${Card[utils.getMe().hand![0]]} ${prompt(
				"What do you do on your date?"
			)}`;
			deal(store.gameW.game);
			store.gameW.info.alert = msg;
			utils.getMe().score++;
			store.update(msg);
		} else {
			const targets = this.getTargets();
			if (targets.length === 0) {
				this.finish("no targets");
			} else if (targets.length === 1) {
				this.execute(targets[0]);
			}
		}
		actioning = false;
	}

	getTargets() {
		return store.gameW.game.players
			.map((player, index) => ({ player, index }))
			.filter((o) => (o.player.played || [])[0] !== Card.handmaid)
			.filter(
				(o) =>
					store.gameW.game.played === Card.prince ||
					o.player.userId !== utils.getCurrent().userId
			)
			.map((o) => o.index);
	}

	execute(index: number) {
		const player = store.gameW.game.players[index];
		switch (store.gameW.game.played) {
			case Card.guard:
				const choice = prompt(`Choose a rank for ${player.userName}`);
				const correct = choice === Ranks[player.hand![0]].toString();
				if (correct) utils.discard(player);
				this.finish(
					`guessed ${choice} for [${player.userName}] - ${
						correct ? "correct" : "incorrect"
					}`
				);
				break;
			case Card.priest:
				alert(utils.cardString(player.hand![0]));
				this.finish(`looked at [${player.userName}]'s hand`);
				break;
			case Card.baron:
				const diff =
					Ranks[player.hand![0]] - Ranks[utils.getMe().hand![0]];
				if (diff === 0) {
					this.finish(`tied [${player.userName}]`);
				} else {
					const loser = diff > 0 ? utils.getMe() : player;
					const cardString = utils.cardString(loser.hand![0]);
					utils.discard(loser);
					this.finish(`[${loser.userName}] out (${cardString})`);
				}
				break;
			case Card.prince:
				const msg = `made [${
					player.userName
				}] discard ${utils.cardString(player.hand![0])}`;
				utils.discard(player);
				if (player.played!.indexOf(Card.princess) !== -1) {
					const draw = store.gameW.game.deck
						? store.gameW.game.deck.pop()!
						: store.gameW.game.aside;
					player.hand = [draw];
				}
				this.finish(msg);
			case Card.king:
				const me = utils.getMe();
				[me.hand, player.hand] = [player.hand, me.hand];
				this.finish(`swapped with [${player.userName}]`);
				break;
		}
	}

	finish(msg: string) {
		delete store.gameW.game.played;
		utils.advanceTurn();
		store.update(msg);
	}

	render() {
		const targets = this.getTargets();
		if (targets.length <= 1) return null;
		return targets
			.map((index) => store.gameW.game.players[index])
			.map((player, index) => (
				<div key={index} className={styles.bubble}></div>
			));
	}
}

export default Action;
