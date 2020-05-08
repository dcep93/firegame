import React from "react";

import { Params } from "./NewGame";
import Hand from "./Hand";
import Board from "./Board";
import Store from "../../../shared/Store";

export type TermType = {
	word: string;
	definition: string;
	image: string;
};

export type PlayerType = {
	index: number;
	username: string;
	userId: string;
	hand: number[];
};

export type GameType = {
	params: Params;
	currentPlayer: number;
	title: string;
	setId: number;
	terms: TermType[];
	deck: number[];
	players: PlayerType[];
	board: number[];
};

class Render extends React.Component<{}, { selectedIndex: number }> {
	render() {
		return (
			<div>
				<Hand
					selectedIndex={this.state ? this.state.selectedIndex : -1}
					selectCard={this.selectCard.bind(this)}
				/>
				<Board selectTarget={this.selectTarget.bind(this)} />
			</div>
		);
	}

	selectCard(selectedIndex: number) {
		if (this.state && this.state.selectedIndex === selectedIndex)
			selectedIndex = -1;
		this.setState({ selectedIndex });
	}

	selectTarget(index: number) {
		if (!this.state || this.state.selectedIndex === -1)
			return alert("need to select a card from hand first");
		const game: GameType = Store.getGameW().game;
		const leftBound = game.board[index - 1];
		const rightBound = game.board[index];
		const me = game.players[game.currentPlayer];
		const cardIndex = me.hand[this.state.selectedIndex];
		var message: string;
		if (this.isBetween(cardIndex, leftBound, rightBound)) {
			message = "CORRECT";
		} else {
			message = "WRONG";
			const deck = game.deck;
			if (deck.length > 0) me.hand.push(deck.pop()!);
		}
		game.board.push(me.hand.splice(this.state.selectedIndex, 1)[0]);
		this.sortBoard();
		this.setState({ selectedIndex: -1 });
		Store.getMe().sendGameState(message, game);
	}

	isBetween(
		cardIndex: number,
		leftBound: number,
		rightBound: number
	): boolean {
		const game: GameType = Store.getGameW().game;
		const playDefinition = parseInt(game.terms[cardIndex].definition);
		const leftCard = game.terms[leftBound];
		const rightCard = game.terms[rightBound];
		if (leftCard && parseInt(leftCard.definition) > playDefinition)
			return false;
		if (rightCard && parseInt(rightCard.definition) < playDefinition)
			return false;
		return true;
	}

	sortBoard(): void {
		const game: GameType = Store.getGameW().game;
		game.board.sort((a, b) => b - a);
	}
}

export default Render;
