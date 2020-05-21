import React from "react";

import utils, { store } from "../../utils";
import bank from "../../utils/bank";

import styles from "../../../../../shared/styles.module.css";
import {
	CommercialType,
	CommercialEnum,
	Color,
	ScienceToken,
	PlayerType,
	Age,
} from "../../utils/types";
import CommercialWonderFromTrash from "./CommercialWonderFromTrash";

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
		if (this.props.commercial.playerIndex === utils.myIndex())
			alert(this.props.commercial.commercial);
	}

	pop() {
		store.gameW.game.commercials!.shift();
	}

	render(): any {
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
							{this.props.commercial.extra.map(
								(scienceName: ScienceToken) => (
									<div
										onClick={() =>
											this.buildScience(scienceName)
										}
										className={styles.bubble}
									>
										{
											ScienceToken[
												utils.enumName(
													scienceName,
													ScienceToken
												)
											]
										}{" "}
										- {scienceName}
									</div>
								)
							)}
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
											if (!utils.isMyTurn()) return;
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
										{
											bank.wonders[obj.wonder.wonderIndex]
												.name
										}
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
											if (!utils.isMyTurn()) return;
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
			case CommercialEnum.unbuild:
				const wondersToUnbuild = utils
					.getMe()
					.wonders.concat(utils.getOpponent().wonders)
					.filter((wonder) => wonder.built);
				if (!wondersToUnbuild) {
					if (!utils.isMyTurn()) return;
					this.pop();
					return alert("no wonders to destroy");
				}
				return (
					<div className={styles.bubble}>
						<h2>Unbuild Wonder</h2>
						<div className={styles.flex}>
							{wondersToUnbuild.map((wonder) => (
								<div
									onClick={() => {
										if (!utils.isMyTurn()) return;
										wonder.built = false;
										this.pop();
										store.update(
											`unbuilt ${
												bank.wonders[wonder.wonderIndex]
													.name
											}`
										);
									}}
								>
									{bank.wonders[wonder.wonderIndex].name}
								</div>
							))}
							)}
						</div>
					</div>
				);
			case CommercialEnum.stealWonder:
				const wondersToSteal = utils
					.getOpponent()
					.wonders.map((wonder, index) => ({ wonder, index }))
					.filter((obj) => !obj.wonder.built);
				if (!wondersToSteal) {
					if (!utils.isMyTurn()) return;
					this.pop();
					return alert("no wonders to steal");
				}
				return (
					<div className={styles.bubble}>
						<h2>Steal Wonder</h2>
						<div className={styles.flex}>
							{wondersToSteal.map((obj) => (
								<div
									onClick={() => {
										if (!utils.isMyTurn()) return;
										const wonder = utils
											.getOpponent()
											.wonders.splice(obj.index, 1)[0];
										utils.getMe().wonders.push(wonder);
										this.pop();
										store.update(
											`stole ${
												bank.wonders[wonder.wonderIndex]
													.name
											}`
										);
									}}
								>
									{bank.wonders[obj.wonder.wonderIndex].name}
								</div>
							))}
							)}
						</div>
					</div>
				);
			case CommercialEnum.wonderFromTrash:
				return <CommercialWonderFromTrash pop={this.pop.bind(this)} />;
			case CommercialEnum.copyScience:
				// todo make this work with a sciences dict
				const sciences = utils
					.getOpponent()
					.cards?.filter(
						(cardIndex) =>
							bank.cards[cardIndex].color === Color.green
					);
				if (!sciences) {
					if (utils.isMyTurn()) {
						this.pop();
						store.update("no sciences to copy");
					}
					return;
				}
				return (
					<div className={styles.bubble}>
						<h2>Copy Science</h2>
						<div className={styles.flex}>
							{sciences.map((index) => (
								<div
									key={index}
									onClick={() => {
										if (!utils.isMyTurn()) return;
										this.pop();
										store.update(
											`copied ${bank.cards[index].extra.science}`
										);
									}}
								>
									{bank.cards[index].extra.science}
								</div>
							))}
							)}
						</div>
					</div>
				);
			case CommercialEnum.enki:
				return (
					<div className={styles.bubble}>
						<h2>Choose a Science Token</h2>
						<div className={styles.flex}>
							{this.props.commercial.extra.map(
								(scienceName: ScienceToken) => (
									<div
										onClick={() =>
											this.buildScience(scienceName)
										}
										className={styles.bubble}
									>
										{
											ScienceToken[
												utils.enumName(
													scienceName,
													ScienceToken
												)
											]
										}{" "}
										- {scienceName}
									</div>
								)
							)}
						</div>
					</div>
				);
			case CommercialEnum.baal:
				const cardsToSteal = utils
					.getOpponent()
					.cards?.map((cardIndex, handIndex) => ({
						handIndex,
						card: bank.cards[cardIndex],
					}))
					?.filter(
						(obj) =>
							obj.card.color === Color.brown ||
							obj.card.color === Color.grey
					);
				if (!cardsToSteal) {
					if (utils.isMyTurn()) {
						this.pop();
						store.update("no cards to steal");
					}
					return;
				}
				return (
					<div className={styles.bubble}>
						<h2>Steal a brown/grey card</h2>
						<div className={styles.flex}>
							{cardsToSteal.map((obj) => (
								<div
									onClick={() => {
										const me = utils.getMe();
										if (!me.cards) me.cards = [];
										me.cards.push(
											utils
												.getOpponent()
												.cards!.splice(
													obj.handIndex,
													1
												)[0]
										);
									}}
									className={styles.bubble}
								>
									{obj.card.name}
								</div>
							))}
						</div>
					</div>
				);
			case CommercialEnum.theater:
				return (
					<div className={styles.bubble}>
						<h2>Pick a god</h2>
						<div className={styles.flex}>
							{Object.values(store.gameW.game.gods)
								.flatMap((gods) => gods)
								.map((godIndex) => (
									<div
										onClick={() => {
											const god = bank.gods[godIndex];
											const gods =
												store.gameW.game.gods[
													god.source!
												];
											const index = gods.indexOf(
												godIndex
											);
											const me = utils.getMe();
											if (!me.gods) me.gods = [];
											me.gods.push(
												gods.splice(index, 1)[0]
											);
										}}
										className={styles.bubble}
										title={JSON.stringify(
											bank.gods[godIndex],
											null,
											2
										)}
									>
										{bank.gods[godIndex].name}
									</div>
								))}
						</div>
					</div>
				);
			case CommercialEnum.gate:
				return (
					<div className={styles.bubble}>
						<h2>Pick a top god</h2>
						<div className={styles.flex}>
							{Object.values(store.gameW.game.gods)
								.map((gods) => gods[0])
								.map((godIndex) => (
									<div
										onClick={() => {
											const god = bank.gods[godIndex];
											const gods =
												store.gameW.game.gods[
													god.source!
												];
											const index = gods.indexOf(
												godIndex
											);
											const me = utils.getMe();
											if (!me.gods) me.gods = [];
											me.gods.push(
												gods.splice(index, 1)[0]
											);
										}}
										className={styles.bubble}
										title={JSON.stringify(
											bank.gods[godIndex],
											null,
											2
										)}
									>
										{bank.gods[godIndex].name}
									</div>
								))}
						</div>
					</div>
				);
		}
		return null;
	}

	// todo cant build the same science
	buildScience(scienceName: ScienceToken) {
		if (!utils.isMyTurn()) return alert("not your turn");
		const me = utils.getMe();
		if (!me.sciences) me.sciences = [];
		me.sciences.push(scienceName);
		this.pop();
		store.update(
			`built ${ScienceToken[utils.enumName(scienceName, ScienceToken)]}`
		);
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
					cost: {wonder.cost.join("")} (${utils.getWonderCost(wonder)}
					)
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
					utils.deal(game);
				}
			}
		}
		store.update(`selected ${bank.wonders[wonderIndex].name}`);
	}
}

export default Commercial;
