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

class Render extends React.Component<{
	sendGameState: (game: GameType) => void;
	game: GameType;
	myIndex: number;
}> {
	render() {
		return (
			<div>
				<Hand game={this.props.game} myIndex={this.props.myIndex} />
				<Board game={this.props.game} />
			</div>
		);
	}
}

export default Render;
