import React from "react";

import Game from "../../../shared/Game";

class App extends Game {
	renderGame() {
		return (
			<p>
				{`timeline function ${this.props.roomId} ${this.state.username} ${this.state.userId}`}
			</p>
		);
	}
}

export default App;
