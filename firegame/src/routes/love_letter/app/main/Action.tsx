import React from "react";

import utils, { store, WINNER } from "../utils/utils";
import { Card, deal, Ranks } from "../utils/NewGame";

import styles from "../../../../shared/styles.module.css";
import Cardinal from "./Cardinal";
import Baroness from "./Baroness";

var actioning = false;

class Action extends React.Component {
	componentDidMount() {
		this.action();
	}

	componentDidUpdate() {
		this.action();
	}

	action() {
		window.requestAnimationFrame(this.actionHelper.bind(this));
	}

	actionHelper() {
		if (
			!utils.isMyTurn() ||
			store.gameW.game.played === undefined ||
			actioning
		)
			return;
		actioning = true;
		switch (store.gameW.game.played) {
			case WINNER:
				if (store.gameW.game.jester === utils.myIndex()) {
					const p = store.gameW.game.players.find(
						(p) => (p.played || []).indexOf(Card.jester) !== -1
					)!;
					delete store.gameW.game.jester;
					p.score++;
					store.update(`wins, [${p.userName}] scores a jester`);
				} else {
					const rawMsg = prompt("What do you do on your date?");
					const msg = `(${Card[utils.getMe().hand![0]]}) ${
						rawMsg || "has a boring date"
					}`;
					deal(store.gameW.game);
					store.gameW.info.alert = msg;
					utils.getMe().score++;
					store.update(msg);
				}
				break;
			case Card.cardinal:
			// @ts-ignore fallthrough
			case Card.baroness:
				break;
			default:
				const targets = this.getTargets();
				if (targets.length === 0) {
					this.finish("no targets");
				} else if (targets.length === 1) {
					this.execute(targets[0]);
				}
				break;
		}
		actioning = false;
	}

	// todo sycophant
	getTargets() {
		return store.gameW.game.players
			.map((player, index) => ({ player, index }))
			.filter((o) => (o.player.played || [])[0] !== Card.handmaid)
			.filter(
				(o) =>
					store.gameW.game.played === Card.prince ||
					store.gameW.game.played === Card.sycophant ||
					store.gameW.game.played === Card.cardinal ||
					o.player.userId !== utils.getCurrent().userId
			)
			.map((o) => o.index);
	}

	execute(index: number) {
		delete store.gameW.game.sycophant;
		const player = store.gameW.game.players[index];
		switch (store.gameW.game.played) {
			case Card.guardX:
			// @ts-ignore fallthrough
			case Card.guard:
				const card = player.hand![0];
				if (card === Card.assassin) {
					utils.discard(player);
					const draw = store.gameW.game.deck
						? store.gameW.game.deck.pop()!
						: store.gameW.game.aside;
					player.hand = [draw];
					utils.discard(utils.getMe());
					this.finish(`was assassinated by ${player.userName}`);
				} else {
					var choice;
					while (true) {
						choice = prompt(`Choose a rank for ${player.userName}`);
						if (choice !== "1") break;
					}
					const correct = choice === Ranks[card].toString();
					if (correct) utils.discard(player);
					this.finish(
						`guessed ${choice} for [${player.userName}] - ${
							correct ? "correct" : "incorrect"
						}`
					);
				}
				break;
			case Card.priest:
				alert(utils.cardString(player.hand![0]));
				this.finish(`looked at [${player.userName}]'s hand`);
				break;
			case Card.baron:
				const diff =
					Ranks[player.hand![0]] - Ranks[utils.getMe().hand![0]];
				if (diff === 0) {
					this.finish(`baron tied [${player.userName}]`);
				} else {
					const loser = diff > 0 ? utils.getMe() : player;
					const cardString = utils.cardString(loser.hand![0]);
					utils.discard(loser);
					this.finish(`baron [${loser.userName}] (${cardString})`);
				}
				break;
			case Card.prince:
				const msg = `made [${
					player.userName
				}] discard ${utils.cardString(player.hand![0])}`;
				utils.discard(player);
				if (player.played!.indexOf(Card.princess) === -1) {
					const draw = store.gameW.game.deck
						? store.gameW.game.deck.pop()!
						: store.gameW.game.aside;
					player.hand = [draw];
				}
				this.finish(msg);
				break;
			case Card.king:
				const me = utils.getMe();
				[me.hand, player.hand] = [player.hand, me.hand];
				this.finish(`swapped with [${player.userName}]`);
				break;
			case Card.jester:
				store.gameW.game.jester = index;
				this.finish(`selected ${player.userName} to win`);
				break;
			case Card.sycophant:
				store.gameW.game.sycophant = index;
				this.finish(`sycophanted ${player.userName}`);
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
		if (store.gameW.game.played === Card.cardinal)
			return (
				<Cardinal targets={targets} finish={this.finish.bind(this)} />
			);
		if (store.gameW.game.played === Card.baroness)
			return (
				<Baroness targets={targets} finish={this.finish.bind(this)} />
			);
		if (targets.length <= 1) return null;
		return targets
			.map((index) => store.gameW.game.players[index])
			.map((player, index) => (
				<div
					key={index}
					className={styles.bubble}
					onClick={() => this.execute(index)}
				>
					{player.userName}
				</div>
			));
	}
}

export default Action;
