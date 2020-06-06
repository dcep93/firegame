import React from "react";

import { store } from "../utils/utils";
import NewGame, { Params } from "../utils/NewGame";

import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";

class Sidebar extends SharedSidebar<Params> {
	name = "Template";
	NewGame = NewGame;

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
