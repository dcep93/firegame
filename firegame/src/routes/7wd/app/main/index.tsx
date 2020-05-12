import React from "react";

import { shared, store } from "../utils";
import bank, { Color } from "../utils/bank";

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
		const myIndex = shared.myIndex();
		return (
			<div>
				<Structure
					selectCard={this.selectCard.bind(this)}
					{...this.props}
				/>
				<div>
					<Player
						index={myIndex}
						selected={
							this.state.selectedTarget === selected.player
								? this.state.selectedWonder
								: undefined
						}
						select={this.selectPlayer.bind(this)}
					/>
					<Player index={1 - myIndex} />
				</div>
				<Board
					select={this.selectBoard.bind(this)}
					selected={this.state.selectedTarget === selected.board}
				/>
			</div>
		);
	}

	reset() {
		this.setState({ selectedTarget: undefined });
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
		const card = store.gameW.game.structure[y][x];
		if (!this.canTake(y, x, card.offset))
			return alert("cannot take that card");
		card.taken = true;
		const rowAboveY = y - 1;
		const rowAbove = store.gameW.game.structure[rowAboveY];
		if (rowAbove)
			rowAbove.forEach(
				(aboveCard, index) =>
					this.canTake(rowAboveY, index, aboveCard.offset) &&
					(aboveCard.revealed = true)
			);
		this.reset();
		const cardName = bank.cards[card.cardIndex].name;
		const me = shared.getMe();
		var message;
		if (this.state.selectedTarget === selected.board) {
			message = `trashed ${cardName}`;
			me.money +=
				BASE_TRASH +
				(me.cards || [])
					.map((cardIndex) => bank.cards[cardIndex])
					.filter((card) => card.color === Color.yellow).length;
		} else if (this.state.selectedWonder === -1) {
			message = `built ${cardName}`;
			if (!me.cards) me.cards = [];
			me.cards.push(card.cardIndex);
		} else {
			message = `built wonder using ${cardName}`;
		}
		// shared.incrementPlayerTurn();
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
}

export default Main;
