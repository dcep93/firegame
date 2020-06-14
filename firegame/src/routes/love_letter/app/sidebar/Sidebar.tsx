import React from "react";

import utils, { store } from "../utils/utils";
import NewGame, { Params } from "../utils/NewGame";

import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";

class Sidebar extends SharedSidebar<Params> {
	name = "Love Letter";
	NewGame = NewGame;
	isMyTurn = utils.isMyTurn.bind(utils);

	renderStartNewGame() {
		return (
			<div>
				<button onClick={this.startNewGame.bind(this)}>New Game</button>
			</div>
		);
	}

	getParams(): Params {
		return { lobby: store.lobby };
	}
}

export default Sidebar;
