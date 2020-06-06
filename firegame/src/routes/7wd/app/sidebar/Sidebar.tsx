import React, { RefObject } from "react";

import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame from "../utils/NewGame";
import { Params } from "../utils/types";
import { store } from "../utils/utils";

class Sidebar extends SharedSidebar<Params> {
	expansionRef: RefObject<HTMLInputElement> = React.createRef();
	name = "7 Wonders Duel";
	NewGame = NewGame;

	renderStartNewGame() {
		return (
			<div>
				<div>
					<label>
						God Expansion:{" "}
						<input type={"checkbox"} ref={this.expansionRef} />
					</label>
				</div>
				<button onClick={this.startNewGame.bind(this)}>New Game</button>
			</div>
		);
	}

	getParams() {
		return {
			godExpansion: this.expansionRef.current!.checked,
			lobby: store.lobby,
		};
	}

	maybeSyncParams() {
		if (store.gameW.info.isNewGame) {
			this.expansionRef.current!.checked =
				store.gameW.game.params.godExpansion;
		}
	}
}

export default Sidebar;
