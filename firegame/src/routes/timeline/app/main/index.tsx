import React from "react";

import store from "../../../../shared/store";

import { sortBoard } from "../utils";
import { GameType } from "../utils/NewGame";

import Hand from "./Hand";
import Board from "./Board";

class Render extends React.Component<{}, { selectedIndex: number }> {
	render() {
		return (
			<div>
				<Hand
					selectedIndex={this.state?.selectedIndex}
					selectCard={this.selectCard.bind(this)}
				/>
				<Board selectTarget={this.selectTarget.bind(this)} />
			</div>
		);
	}

	selectCard(selectedIndex: number) {
		if (this.state?.selectedIndex === selectedIndex) selectedIndex = -1;
		this.setState({ selectedIndex });
	}

	selectTarget(index: number) {
		if (!(this.state?.selectedIndex > -1))
			return alert("need to select a card from hand first");
		const game: GameType = store.gameW.game;
		const leftBound = game.board[index - 1];
		const rightBound = game.board[index];
		const me = game.players[game.currentPlayer];
		const termIndex = me.hand[this.state.selectedIndex];
		const term = store.gameW.game.terms[termIndex];
		const correct = this.isBetween(term, leftBound, rightBound);
		if (!correct) {
			const deck = game.deck;
			if (deck.length > 0) me.hand.push(deck.pop()!);
		}
		game.last = { correct, termIndex };
		game.board.push(me.hand.splice(this.state.selectedIndex, 1)[0]);
		sortBoard(store.gameW.game);
		this.setState({ selectedIndex: -1 });
		const message = `played [${term.word}]: [${term.definition}] - ${
			correct ? "CORRECT" : "WRONG"
		}`;
		store.update(message, game);
	}

	// todo lets be safer here
	isBetween(
		term: { definition: string },
		leftBound: number,
		rightBound: number
	): boolean {
		const game: GameType = store.gameW.game;
		const playDefinition = parseInt(term.definition);
		const leftCard = game.terms[leftBound];
		const rightCard = game.terms[rightBound];
		if (leftCard && parseInt(leftCard.definition) > playDefinition)
			return false;
		if (rightCard && parseInt(rightCard.definition) < playDefinition)
			return false;
		return true;
	}
}

export default Render;
