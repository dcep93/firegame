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
				const jester = store.gameW.game.jester;
				delete store.gameW.game.jester;
				if (store.gameW.game.tiedPlayers) {
					const tiedPlayers = store.gameW.game.tiedPlayers;
					delete store.gameW.game.tiedPlayers;
					deal(store.gameW.game);
					store.update(
						`no one wins because of a tie between ${tiedPlayers
							.map((i) => store.gameW.game.players[i].userName)
							.join(",")}`
					);
				}
				if (jester === utils.myIndex()) {
					const p = store.gameW.game.players.find(
						(p) => (p.played || []).indexOf(Card.jester) !== -1
					)!;
					p.score++;
					store.update(`wins, [${p.userName}] scores a jester`);
				} else {
					delete store.gameW.game.played;
					const rawMsg = prompt("What do you do on your date?");
					const ranks = store.gameW.game.players
						.filter((p) => p.hand)
						.map(
							(p) =>
								`${p.userName}: ${utils.cardString(p.hand![0])}`
						)
						.join(", ");
					const msg = `{${ranks}} ${rawMsg || "has a boring date"}`;
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
			case Card.bishop:
				if (store.gameW.game.bishop !== undefined) {
					const toDiscard = window.confirm(
						"You were correctly guessed by the bishop. Would you like to discard your hand?"
					);
					const cardB = utils.getMe().hand![0];
					if (toDiscard) utils.discard(utils.getMe(), false);
					store.gameW.game.currentPlayer = store.gameW.game.bishop;
					delete store.gameW.game.bishop;
					this.finish(
						toDiscard
							? `discarded ${utils.cardString(cardB)}`
							: "did not discard"
					);
					break;
				}
			// @ts-ignore fallthrough
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

	getTargets() {
		return store.gameW.game.players
			.map((player, index) => ({ player, index }))
			.filter((o) => o.player.hand)
			.filter((o) => (o.player.played || [])[0] !== Card.handmaid)
			.filter(
				(o) =>
					store.gameW.game.sycophant === undefined ||
					o.index === store.gameW.game.sycophant ||
					store.gameW.game.played === Card.cardinal ||
					store.gameW.game.played === Card.baroness
			)
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
		const player = store.gameW.game.players[index];
		switch (store.gameW.game.played) {
			case Card.guardX:
			// @ts-ignore fallthrough
			case Card.guard:
				const card = player.hand![0];
				if (card === Card.assassin) {
					utils.discard(player, false);
					utils.discard(utils.getMe(), true);
					this.finish(`was assassinated by ${player.userName}`);
				} else {
					var choice;
					for (let i = 0; i < 10; i++) {
						choice = prompt(`Choose a rank for ${player.userName}`);
						if (choice !== "1" && choice !== null) break;
					}
					const correct = choice === Ranks[card].toString();
					if (correct) utils.discard(player, true);
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
					utils.discard(loser, true);
					this.finish(`baron [${player.userName}] (${cardString})`);
				}
				break;
			case Card.prince:
				const msg = `made [${
					player.userName
				}] discard ${utils.cardString(player.hand![0])}`;
				utils.discard(player, false);
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
				// need to set sycophant before finishing::advancingTurn
				// because advancingTurn resets sycophant
				this.finish();
				store.gameW.game.sycophant = index;
				store.update(`sycophanted ${player.userName}`);
				break;
			case Card.queen:
				const diffQ =
					Ranks[player.hand![0]] - Ranks[utils.getMe().hand![0]];
				if (diffQ === 0) {
					this.finish(`queen tied [${player.userName}]`);
				} else {
					const loser = diffQ < 0 ? utils.getMe() : player;
					const cardString = utils.cardString(loser.hand![0]);
					utils.discard(loser, true);
					this.finish(`queen [${player.userName}] (${cardString})`);
				}
				break;
			case Card.bishop:
				var choiceB;
				for (let i = 0; i < 10; i++) {
					choiceB = prompt(`Choose a rank for ${player.userName}`);
					if (choiceB !== null) break;
				}
				const correct = choiceB === Ranks[player.hand![0]].toString();
				const msgB = `guessed ${choiceB} for [${player.userName}] - ${
					correct ? "correct" : "incorrect"
				}`;
				if (correct) {
					utils.getMe().score++;
					store.gameW.game.bishop = utils.myIndex();
					store.gameW.game.currentPlayer = index;
					store.update(msgB);
				} else {
					this.finish(msgB);
				}
				break;
		}
	}

	finish(msg?: string) {
		delete store.gameW.game.played;
		utils.advanceTurn();
		if (msg !== undefined) store.update(msg);
	}

	render() {
		if (!utils.isMyTurn() || store.gameW.game.played === undefined)
			return null;
		if (store.gameW.game.bishop !== undefined) return null;
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
			.map((index) => ({
				index,
				player: store.gameW.game.players[index],
			}))
			.map((o, index) => (
				<div
					key={index}
					className={styles.bubble}
					onClick={() => this.execute(o.index)}
				>
					{o.player.userName}
				</div>
			));
	}
}

export default Action;
