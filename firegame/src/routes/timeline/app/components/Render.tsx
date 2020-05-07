import React from "react";

export type GameType = { dan: number };

class Render extends React.Component<{
	sendGameState: (game: GameType) => void;
	id: number;
	game: GameType;
}> {
	render() {
		return (
			<div>
				<p>dan: {this.props.game.dan}</p>
				<p>{`timeline ${JSON.stringify(this.props.game)} ${
					this.props.id
				}`}</p>
				<button onClick={this.increment.bind(this)}>abc</button>
			</div>
		);
	}

	increment(): void {
		this.props.game.dan++;
		this.props.sendGameState(this.props.game);
	}
}

export default Render;
