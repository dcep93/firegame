import React from "react";

import { Params } from "./NewGame";

export type TermType = {
	term: string;
	definition: string;
};

export type PlayerType = { username: string; userId: string; hand: number[] };

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
	id: number;
	game: GameType;
}> {
	render() {
		return (
			<div>
				<p>
					dan: {this.props.game.setId}
					id: {this.props.id}
				</p>
				<pre>{JSON.stringify(this.props.game, null, 2)}</pre>
				<button onClick={this.increment.bind(this)}>abc</button>
			</div>
		);
	}

	increment(): void {
		this.props.game.setId++;
		this.props.sendGameState(this.props.game);
	}
}

export default Render;
