import React from "react";

import Game from "../../../shared/Game";

class App extends Game {
	render() {
		return (
			<div>
				<p>
					{`timeline function ${this.props.roomId} ${this.state.username} ${this.state.sessionId}`}
				</p>
				{this.renderLobby()}
			</div>
		);
	}
}

export default App;
