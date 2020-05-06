import React from "react";

import Game from "../../../shared/Game";

class App extends Game {
	gameName() {
		return "timeline";
	}

	startNewGame() {
		return { thetimeitisrightnow: Date.now() };
	}

	increment() {
		this.state.game.thetimeitisrightnow++;
		this.sendGameStateHelper();
	}

	renderGame() {
		return (
			<div>
				<p>
					{`timeline function ${this.props.roomId} ${JSON.stringify(
						this.state.game
					)} ${this.state.username} ${this.state.userId}`}
				</p>
				<button onClick={this.increment.bind(this)}>Button</button>
			</div>
		);
	}
}

export default App;
