import React from "react";

import { store, getWonderCost, utils, deal } from "../utils";
import {
	CommercialEnum,
	commercials,
	PlayerType,
	CommercialType,
} from "../utils/NewGame";

import styles from "../../../../shared/styles.module.css";
import bank, { Age, Color, ScienceToken } from "../utils/bank";
import { NUM_SCIENCES } from "./Science";

class Commercial extends React.Component<{
	commercial: CommercialType;
	selectedPantheon?: number;
	reset: () => void;
}> {
	componentDidMount() {
		this.alert();
	}

	componentDidUpdate() {
		this.alert();
	}

	alert() {
		return;
		if (this.props.commercial.playerIndex === utils.myIndex())
			alert(commercials[this.props.commercial.commercial]);
	}

	pop() {
		store.gameW.game.commercials!.shift();
	}

	render() {
		switch (this.props.commercial.commercial) {
			case CommercialEnum.chooseWonder:
				const params = this.props.commercial.extra;
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
					if (!utils.isMyTurn()) return;
					this.pop();
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
			case CommercialEnum.destroyWonder:
				return (
					<div className={styles.bubble}>
						<h2>Destroy Wonder</h2>
						<div className={styles.flex}>
							{utils
								.getMe()
								.wonders.map((wonder, index) => ({
									wonder,
									index,
								}))
								.filter((obj) => !obj.wonder.built)
								.map((obj) => (
									<div
										onClick={() => {
											utils
												.getMe()
												.wonders.splice(obj.index, 1);
											this.pop();
											store.update(
												`destroyed ${
													bank.wonders[
														obj.wonder.wonderIndex
													].name
												}`
											);
										}}
									>
										hi
									</div>
								))}
							)}
						</div>
					</div>
				);
			case CommercialEnum.pickGod:
				if (!utils.isMyTurn()) return null;
				return (
					<div className={styles.bubble}>
						<div className={styles.flex}>
							{store.gameW.game.gods[
								store.gameW.game.godTokens[0]
							]
								.slice(0, 2)
								.map((godIndex, tokenIndex) => (
									<div
										key={tokenIndex}
										onClick={() => {
											if (
												this.props.selectedPantheon ===
												undefined
											)
												return alert(
													"need to select a target first"
												);
											const selected = store.gameW.game.gods[
												store.gameW.game.godTokens[0]
											].splice(tokenIndex, 1)[0];
											store.gameW.game.pantheon[
												this.props.selectedPantheon
											] = selected;
											const me = utils.getMe();
											if (!me.tokens) me.tokens = [];
											me.tokens.push({
												value: store.gameW.game.godTokens.shift()!,
												isGod: true,
											});
											this.pop();
											store.update("placed a god");
											this.props.reset();
										}}
										className={styles.bubble}
										title={JSON.stringify(
											bank.gods[godIndex],
											null,
											2
										)}
									>
										<p>{bank.gods[godIndex].name}</p>
										<p>{bank.gods[godIndex].message}</p>
									</div>
								))}
						</div>
					</div>
				);
		}
		return null;
	}

	buildScience(scienceName: ScienceToken) {
		if (!utils.isMyTurn()) return alert("not your turn");
		const me = utils.getMe();
		if (!me.sciences) me.sciences = [];
		me.sciences.push(scienceName);
		this.pop();
		store.update(`built ${ScienceToken[scienceName]}`);
	}

	reviveCard(trashIndex: number) {
		if (!utils.isMyTurn()) return alert("not your turn");
		const cardIndex = store.gameW.game.trash!.splice(trashIndex, 1)[0];
		this.pop();
		const me = utils.getMe();
		if (!me.cards) me.cards = [];
		me.cards.push(cardIndex);
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
			if (!utils.isMyTurn()) return;
			this.pop();
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
		if (!utils.isMyTurn()) return alert("not your turn");
		const cardIndex = victim.cards!.splice(handIndex, 1)[0];
		this.pop();
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
		const c = store.gameW.game.commercials![0];
		c.extra.remaining--;
		if (c.extra.remaining !== 2) {
			c.playerIndex = utils.getOpponent().index;
			if (c.extra.remaining === 0) {
				if (c.extra.firstRound) {
					c.extra.firstRound = false;
					c.extra.remaining = 4;
				} else {
					this.pop();
					const game = store.gameW.game;
					game.age = Age.one;
					deal(game);
				}
			}
		}
		store.update(`selected ${bank.wonders[wonderIndex].name}`);
	}
}

export default Commercial;
