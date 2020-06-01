import React from "react";

import utils, { store } from "../utils/utils";
import { Rank } from "../utils/NewGame";

class Action extends React.Component {
	componentDidMount() {
		this.action();
	}

	componentDidUpdate() {
		this.action();
	}

	action() {
		if (!utils.isMyTurn()) return;
		switch (store.gameW.game.played) {
			case Rank.guard:
			case Rank.priest:
			case Rank.baron:
			case Rank.prince:
			case Rank.king:
		}
	}

	render() {
		const info = store.gameW.info;
		return (
			<h2>
				[{info.playerName}] {info.message}
			</h2>
		);
	}

	finish(message: string) {
		delete store.gameW.game.played;
		store.update(message);
	}
}

export default Action;
