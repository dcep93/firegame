import React from "react";

import Game from "../../../shared/Game";

import Timeline from "./timeline";

class App extends Game {
	buildNewGame() {
		return { thetimeitisrightnow: Date.now() };
	}

	renderGame() {
		return (
			<Timeline
				game={this.state.game}
				sendGameState={this.sendGameState.bind(this)}
			/>
		);
	}
}

export default App;
