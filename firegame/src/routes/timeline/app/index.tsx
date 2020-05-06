import React from "react";

import Game from "../../../shared/Game";

type GameType = { dan: number };

class Timeline extends Game<GameType> {
	buildNewGame(): GameType {
		return { dan: Date.now() };
	}

	render() {
		return (
			<div>
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

export default Timeline;
