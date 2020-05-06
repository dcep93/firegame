import React from "react";

import Game from "../../../shared/Game";

class App extends Game {
	gameName() {
		return "timeline";
	}

	startNewGame() {
		return Date.now();
	}

	renderGame() {
		return (
			<p>
				{`timeline function ${this.props.roomId} ${JSON.stringify(
					this.state.game
				)} ${this.state.username} ${this.state.userId}`}
			</p>
		);
	}
}

export default App;
