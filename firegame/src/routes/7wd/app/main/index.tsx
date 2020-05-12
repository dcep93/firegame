import React from "react";

import { utils, store, getCost, handleNextMilitary } from "../utils";
import bank, { Color, CardType } from "../utils/bank";

import Structure from "./Structure";
import Player from "./Player";
import Board from "./Board";

export enum selected {
	player,
	board,
}

const BASE_TRASH = 2;

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
				<Board
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
		if (this.state.selectedTarget === undefined)
			return alert("need to select a target first");
		const structureCard = store.gameW.game.structure[y][x];
		if (!this.canTake(y, x, structureCard.offset))
			return alert("cannot take that card");
		const card = bank.cards[structureCard.cardIndex];
		if (this.state.selectedWonder === -1) {
			const cost = getCost(card);
			if (cost > utils.getMe().money)
				return alert("cannot afford that card");
			utils.getMe().money -= cost;
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
		utils.incrementPlayerTurn();
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
		if (card.extra.f) card.extra.f();
		if (card.extra.military) {
			utils.getMe().military += card.extra.military;
			const militaryDiff =
				utils.getMe().military - utils.getOpponent().military;
			while (militaryDiff >= utils.getMe().nextMilitary) {
				utils.getMe().nextMilitary = handleNextMilitary();
			}
		}
	}
}

export default Main;
