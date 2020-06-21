import React from "react";
import utils, { store } from "../utils/utils";

import { Difficulty } from "../utils/NewGame";

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
		// todo real card and target
		const card = { a: "a", b: "b" };
		const target = 66;
		store.gameW.game.cardW = { difficulty, card, target };
		store.update(`drew [${Difficulty[difficulty]}]`);
	}
}

export default Draw;
