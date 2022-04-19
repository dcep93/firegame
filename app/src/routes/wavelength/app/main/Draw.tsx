import React from "react";
import utils, { store } from "../utils/utils";

import { Difficulty } from "../utils/NewGame";
import bank from "./bank";

class Draw extends React.Component {
	render() {
		return (
			<div>
				{utils.enumArray(Difficulty).map((d) => (
					<button onClick={() => this.draw(d)} key={d}>
						Draw {Difficulty[d]}
					</button>
				))}
			</div>
		);
	}

	draw(difficulty: Difficulty) {
		const myIndex = utils.myIndex();
		if (myIndex === -1) return;
		store.gameW.game.currentPlayer = myIndex;
		const card = utils.shuffle(Array.from(bank[difficulty]))[0];
		const target = Math.floor(Math.random() * 101);
		store.gameW.game.cardW = { difficulty, card, target };
		store.update(`drew [${Difficulty[difficulty]}]`);
	}
}

export default Draw;
