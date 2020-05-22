import React from "react";

import { shared, store, sortBoard } from "../utils";
import { GameType } from "../utils/NewGame";

import Hand from "./Hand";
import Board from "./Board";

class Main extends React.Component<{}, { selectedIndex: number }> {
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
		if (!shared.isMyTurn()) return;
		if (this.state?.selectedIndex === selectedIndex) selectedIndex = -1;
		this.setState({ selectedIndex });
	}

	selectTarget(targetIndex: number) {
		if (!shared.isMyTurn()) return;
		if (!(this.state?.selectedIndex > -1))
			return alert("need to select a card from hand first");
		const game = store.gameW.game;
		const leftBound = game.board[targetIndex - 1];
		const rightBound = game.board[targetIndex];
		const me = game.players[game.currentPlayer];
		const termIndex = me.hand[this.state.selectedIndex];
		const correct = this.isBetween(termIndex, leftBound, rightBound);
		game.last = { correct, termIndex };
		if (!correct) {
			const deck = game.deck;
			if (deck.length > 0) me.hand.push(deck.pop()!);
			game.last.wrongTarget =
				leftBound > termIndex ? targetIndex + 1 : targetIndex;
		}
		game.board.push(me.hand.splice(this.state.selectedIndex, 1)[0]);
		sortBoard(store.gameW.game);
		this.setState({ selectedIndex: -1 });
		const term = store.gameW.game.terms[termIndex];
		const message = `played [${term.word}]: [${term.definition}] - ${
			correct ? "CORRECT" : "WRONG"
		}`;
		shared.incrementPlayerTurn();
		store.update(message);
	}

	isBetween(
		termIndex: number,
		leftBound: number,
		rightBound: number
	): boolean {
		if (leftBound > termIndex || rightBound < termIndex) {
			const game: GameType = store.gameW.game;
			const definition = game.terms[termIndex].definition;
			return (
				game.terms[leftBound]?.definition === definition ||
				game.terms[rightBound]?.definition === definition
			);
		}
		return true;
	}
}

export default Main;
