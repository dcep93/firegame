import React from "react";

import { store, getWonderCost, utils, deal } from "../utils";
import { CommercialEnum, commercials, PlayerType } from "../utils/NewGame";

import styles from "../../../../shared/styles.module.css";
import bank, { Age, Color, ScienceToken } from "../utils/bank";
import { NUM_SCIENCES } from "./Science";

class Commercial extends React.Component {
	componentDidMount() {
		this.alert();
	}

	componentDidUpdate() {
		this.alert();
	}

	alert() {
		if (utils.isMyTurn()) alert(commercials[store.gameW.game.commercial!]);
	}

	render() {
		switch (store.gameW.game.commercial) {
			case CommercialEnum.chooseWonder:
				const params = store.gameW.game.extra;
				return (
					<div className={styles.bubble}>
						<h2>Wonders</h2>
						<div className={styles.flex}>
							{Object.keys(
								Array.from(new Array(params.remaining))
							).map((index: string) => (
								<div key={index} className={styles.bubble}>
									{this.renderWonder(
										parseInt(index),
										params.wonders
									)}
								</div>
							))}
						</div>
					</div>
				);
			case CommercialEnum.destroyGrey:
				return this.renderDestroy(Color.grey);
			case CommercialEnum.destroyBrown:
				return this.renderDestroy(Color.brown);
			case CommercialEnum.revive:
				const cards = store.gameW.game.trash || [];
				if (!cards) {
					utils.incrementPlayerTurn();
					delete store.gameW.game.commercial;
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
			case CommercialEnum.library:
				return (
					<div className={styles.bubble}>
						<h2>Library</h2>
						<div className={styles.flex}>
							{store.gameW.game.sciences
								.slice(NUM_SCIENCES, NUM_SCIENCES + 3)
								.map((scienceName) => (
									<div
										onClick={() =>
											this.buildScience(scienceName)
										}
										className={styles.bubble}
									>
										{ScienceToken[scienceName]} -{" "}
										{bank.sciences[scienceName]}
									</div>
								))}
						</div>
					</div>
				);
		}
		return null;
	}

	buildScience(scienceName: ScienceToken) {
		if (!utils.getMe().sciences) utils.getMe().sciences = [];
		utils.getMe().sciences.push(scienceName);
		utils.incrementPlayerTurn();
		delete store.gameW.game.commercial;
		store.update(`built ${ScienceToken[scienceName]}`);
	}

	reviveCard(trashIndex: number) {
		const cardIndex = store.gameW.game.trash.splice(trashIndex, 1)[0];
		utils.incrementPlayerTurn();
		delete store.gameW.game.commercial;
		if (!utils.getMe().cards) utils.getMe().cards = [];
		utils.getMe().cards.push(cardIndex);
		store.update(`revived ${bank.cards[cardIndex].name}`);
	}

	renderDestroy(color: Color) {
		const victim = store.gameW.game.players[1 - utils.getCurrent().index];
		const cards = (victim.cards || [])
			.map((cardIndex) => ({
				cardIndex,
				card: bank.cards[cardIndex],
			}))
			.filter((card) => card.card.color === color);
		if (!cards) {
			utils.incrementPlayerTurn();
			delete store.gameW.game.commercial;
			store.update(`could not destroy a ${Color[color]} card`);
			return;
		}
		return (
			<div className={styles.bubble}>
				<h2>
					{victim.userName}'s {Color[color]} Cards
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
		const cardIndex = victim.cards.splice(handIndex, 1)[0];
		utils.incrementPlayerTurn();
		delete store.gameW.game.commercial;
		if (!store.gameW.game.trash) store.gameW.game.trash = [];
		store.gameW.game.trash.push(cardIndex);
		store.update(`destroyed ${bank.cards[cardIndex].name}`);
	}

	renderWonder(index: number, wonders: number[]) {
		const wonder = bank.wonders[wonders[index]];
		return (
			<div
				title={JSON.stringify(wonder, null, 2)}
				onClick={() => this.chooseWonder(index, wonders)}
			>
				<p>{wonder.name}</p>
				<p>{wonder.message}</p>
				<div>
					cost: {wonder.cost.join("")} (${getWonderCost(wonder)})
				</div>
			</div>
		);
	}

	chooseWonder(index: number, wonders: number[]) {
		if (!utils.isMyTurn()) return alert("not your turn");
		const wonderIndex = wonders.splice(index, 1)[0];
		if (!utils.getMe().wonders) utils.getMe().wonders = [];
		utils.getMe().wonders.push({ built: false, wonderIndex });
		const game = store.gameW.game;
		const params = game.extra;
		params.remaining--;
		if (params.remaining !== 2) {
			utils.incrementPlayerTurn();
			if (params.remaining === 0) {
				if (params.firstRound) {
					params.firstRound = false;
					params.remaining = 4;
				} else {
					delete store.gameW.game.extra;
					delete store.gameW.game.commercial;
					game.wentFirst = utils.myIndex();
					game.age = Age.one;
					deal(game);
				}
			}
		}
		store.update(`selected ${bank.wonders[wonderIndex].name}`);
	}
}

export default Commercial;
