import React from "react";

import {
	utils,
	store,
	getCardCost,
	stealMoney,
	deal,
	increaseMilitary,
} from "../utils";
import bank, {
	Color,
	CardType,
	ScienceToken,
	ScienceEnum,
	Age,
} from "../utils/bank";
import { CommercialEnum, commercials } from "../utils/NewGame";

import Structure from "./Structure";
import Player from "./Player";
import Military from "./Military";
import Trash from "./Trash";
import Commercial from "./Commercial";
import Science from "./Science";

export enum selected {
	player,
	board,
}

const BASE_TRASH = 2;
const SCIENCE_TO_WIN = 6;

class Main extends React.Component<
	{},
	{ selectedTarget?: selected; selectedWonder?: number }
> {
	constructor(props: {}) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				{utils.isMyTurn() &&
					store.gameW.game.commercial !== undefined && <Commercial />}
				<div>
					<Military />
				</div>
				<div>
					<Science />
				</div>
				<Structure
					selectCard={this.selectCard.bind(this)}
					{...this.props}
				/>
				<div>
					<Player
						player={utils.getMe()}
						selected={
							this.state.selectedTarget === selected.player
								? this.state.selectedWonder
								: undefined
						}
						select={this.selectPlayer.bind(this)}
					/>
					<Player player={utils.getOpponent()} />
				</div>
				<Trash
					select={this.selectBoard.bind(this)}
					selected={this.state.selectedTarget === selected.board}
				/>
			</div>
		);
	}

	reset() {
		this.setState({ selectedTarget: undefined, selectedWonder: undefined });
	}

	selectPlayer(selectedWonder: number) {
		if (this.state.selectedTarget !== undefined) return this.reset();
		this.setState({ selectedTarget: selected.player, selectedWonder });
	}

	selectBoard() {
		if (this.state.selectedTarget !== undefined) return this.reset();
		this.setState({ selectedTarget: selected.board });
	}

	selectCard(x: number, y: number) {
		const commercial = commercials[store.gameW.game.commercial!];
		if (commercial) return alert(commercial);
		if (this.state.selectedTarget === undefined)
			return alert("need to select a target first");
		const structureCard = store.gameW.game.structure[y][x];
		if (!this.canTake(y, x, structureCard.offset))
			return alert("cannot take that card");
		const card = bank.cards[structureCard.cardIndex];
		if (this.state.selectedWonder === -1) {
			const cost = getCardCost(card);
			if (cost > utils.getMe().money)
				return alert("cannot afford that card");
			utils.getMe().money -= cost;
			if (
				(utils.getOpponent().sciences || []).includes(
					ScienceToken.economy
				)
			)
				utils.getOpponent().money += cost;
		}
		structureCard.taken = true;
		const rowAboveY = y - 1;
		const rowAbove = store.gameW.game.structure[rowAboveY];
		if (rowAbove)
			rowAbove.forEach(
				(aboveCard, index) =>
					this.canTake(rowAboveY, index, aboveCard.offset) &&
					(aboveCard.revealed = true)
			);
		this.reset();
		const me = utils.getMe();
		var message;
		if (this.state.selectedTarget === selected.board) {
			message = `trashed ${card.name}`;
			me.money +=
				BASE_TRASH +
				(me.cards || [])
					.map((cardIndex) => bank.cards[cardIndex])
					.filter((card) => card.color === Color.yellow).length;
		} else if (this.state.selectedWonder === -1) {
			message = `built ${card.name}`;
			if (!me.cards) me.cards = [];
			me.cards.push(structureCard.cardIndex);
			this.handlePurchase(card);
		} else {
			message = `built wonder using ${card.name}`;
		}
		if (store.gameW.game.commercial === undefined)
			utils.incrementPlayerTurn();
		if (
			store.gameW.game.structure.flat().filter((sc) => !sc.taken)
				.length === 0
		) {
			switch (store.gameW.game.age) {
				case Age.one:
					store.gameW.game.age = Age.two;
					deal(store.gameW.game);
					break;
				case Age.two:
					store.gameW.game.age = Age.three;
					deal(store.gameW.game);
					break;
				case Age.three:
					alert("game over");
					break;
			}
		}
		store.update(message);
	}

	canTake(y: number, x: number, offset: number): boolean {
		const rowBelow = store.gameW.game.structure[y + 1];
		if (!rowBelow) return true;
		const gridX = x * 2 + offset;
		const cardsBelow = rowBelow.filter(
			(card, index) =>
				!card.taken && Math.abs(card.offset + index * 2 - gridX) === 1
		);
		return cardsBelow.length === 0;
	}

	handlePurchase(card: CardType) {
		const me = utils.getMe();
		const sciences = me.sciences || [];
		if (card.extra.f) card.extra.f();
		if (
			card.upgradesFrom !== undefined &&
			(me.sciences || []).includes(ScienceToken.urbanism)
		) {
			if (
				me.cards.filter(
					(cardIndex) =>
						bank.cards[cardIndex].upgradesTo === card.upgradesFrom
				).length > 0
			)
				me.money += 4;
		}
		if (card.extra.military) {
			var military = card.extra.military;
			if (sciences.includes(ScienceToken.strategy)) military++;
			increaseMilitary(military);
		}
		if (card.extra.science) {
			const scienceCards = me.cards
				.map((cardIndex) => bank.cards[cardIndex].extra.science)
				.filter(Boolean);
			if (sciences.includes(ScienceToken.law))
				scienceCards.push(ScienceEnum.law);
			if (new Set(scienceCards).size >= SCIENCE_TO_WIN) alert("you win");
			if (
				scienceCards.filter((science) => science === card.extra.science)
					.length === 2
			) {
				store.gameW.game.commercial = CommercialEnum.science;
			}
		}
	}
}

export default Main;
