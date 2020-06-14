import React from "react";

import Me from "./Me";
import Players from "./Players";
import Cards from "./Cards";
import Nobles from "./Nobles";
import Tokens from "./Tokens";
import { Level, Token, Card } from "../utils/bank";
import utils, { store } from "../utils/utils";

class Main extends React.Component<
	{},
	{ goldSelected: boolean; selectedTokens: { [n: number]: boolean } }
> {
	constructor(props: {}) {
		super(props);
		this.state = { goldSelected: false, selectedTokens: {} };
	}

	render() {
		return (
			<>
				<Me />
				<br />
				<Players />
				<br />
				<Cards
					goldSelected={this.state.goldSelected}
					buyCard={this.buyCard.bind(this)}
				/>
				<br />
				<Nobles />
				<br />
				<Tokens
					goldSelected={this.state.goldSelected}
					selectGold={this.selectGold.bind(this)}
				/>
			</>
		);
	}

	buyCard(level: Level, index: number) {
		const card = store.gameW.game.cards[level]![index];
		const price = Object.assign({}, card.price);
		const me = utils.getMe();
		(me.hand || []).forEach((c) => price[c.color] && price[c.color]!--);
		var goldToPay = 0;
		Object.entries(this.state.selectedTokens)
			.map(([index, selected]) => ({
				index: parseInt(index),
				selected,
			}))
			.filter((obj) => obj.selected)
			.map((obj) => obj.index)
			.map((index) => me.tokens![index])
			.forEach((t) => {
				if (t === Token.gold) {
					goldToPay++;
					return;
				}
				price[t]!--;
			});

		var outstanding = 0;
		Object.keys(price)
			.map((t) => parseInt(t))
			.forEach((t: Token) => {
				let bill: number = price[t]!;
				if (bill < 0) outstanding = NaN;
				outstanding += bill;
			});
		if (outstanding !== goldToPay) {
			alert("Incorrect payment");
			return;
		}
		Object.entries(this.state.selectedTokens)
			.map(([index, selected]) => ({
				index: parseInt(index),
				selected,
			}))
			.filter((obj) => obj.selected)
			.map((obj) => obj.index)
			.sort()
			.forEach(
				(index, time) =>
					store.gameW.game.tokens[
						me.tokens!.splice(index - time, 1)[0]!
					]++
			);
		if (!me.cards) me.cards = [];
		me.cards.push(card);
		me.cards.sort((a, b) => this.handValue(a) - this.handValue(b));
		const myColors: { [t in Token]?: number } = {};
		me.cards.forEach((c) => {
			myColors[c.color] = 1 + (myColors[c.color] || 0);
		});
		if (store.gameW.game.nobles) {
			store.gameW.game.nobles
				.map((noble, index) => ({ noble, index }))
				.filter(
					(obj) =>
						Object.entries(obj.noble)
							.map(([token, number]) => ({
								token: parseInt(token) as Token,
								number,
							}))
							.map(
								(obj) =>
									(myColors[obj.token] || 0) < obj.number!
							)
							.filter(Boolean).length === 0
				)
				.forEach((obj, time) => {
					store.gameW.game.nobles!.splice(obj.index - time, 1);
					me.nobles++;
				});
		}
		utils.finishTurn("bought a card");
	}

	handValue(c: Card) {
		return parseInt(
			`${c.level}${c.color}.${Array.from(JSON.stringify(c)).map((i) =>
				i.codePointAt(0)
			)}`
		);
	}

	selectGold(allowSelect: boolean) {
		this.setState({
			goldSelected: allowSelect && !this.state.goldSelected,
		});
	}
}

export default Main;
