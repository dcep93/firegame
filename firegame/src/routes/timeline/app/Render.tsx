import React from "react";

import { Params } from "./NewGame";
import Hand from "./Hand";
import Board from "./Board";

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

class Render extends React.Component<
	{
		sendGameState: (message: string, game: GameType) => void;
		game: GameType;
		myIndex: number;
	},
	{ selectedIndex: number }
> {
	render() {
		return (
			<div>
				<Hand
					game={this.props.game}
					myIndex={this.props.myIndex}
					selectedIndex={this.state ? this.state.selectedIndex : -1}
					selectCard={this.selectCard.bind(this)}
				/>
				<Board
					game={this.props.game}
					selectTarget={this.selectTarget.bind(this)}
				/>
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
		const leftBound = this.props.game.board[index - 1];
		const rightBound = this.props.game.board[index];
		const me = this.props.game.players[this.props.game.currentPlayer];
		const cardIndex = me.hand[this.state.selectedIndex];
		var message: string;
		if (this.isBetween(cardIndex, leftBound, rightBound)) {
			message = "CORRECT";
		} else {
			message = "WRONG";
			const deck = this.props.game.deck;
			if (deck.length > 0) me.hand.push(deck.pop()!);
		}
		this.props.game.board.push(
			me.hand.splice(this.state.selectedIndex, 1)[0]
		);
		this.sortBoard();
		this.setState({ selectedIndex: -1 });
		this.props.sendGameState(message, this.props.game);
	}

	isBetween(
		cardIndex: number,
		leftBound: number,
		rightBound: number
	): boolean {
		const playDefinition = parseInt(
			this.props.game.terms[cardIndex].definition
		);
		const leftCard = this.props.game.terms[leftBound];
		const rightCard = this.props.game.terms[rightBound];
		if (leftCard && parseInt(leftCard.definition) > playDefinition)
			return false;
		if (rightCard && parseInt(rightCard.definition) < playDefinition)
			return false;
		return true;
	}

	sortBoard(): void {
		this.props.game.board.sort((a, b) => b - a);
	}
}

export default Render;
