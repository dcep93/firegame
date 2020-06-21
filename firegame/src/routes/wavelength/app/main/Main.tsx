import React from "react";

import Players from "./Players";
import Draw from "./Draw";
import Card from "./Card";
import Clue from "./Clue";
import LastRound from "./LastRound";
import { store } from "../utils/utils";

class Main extends React.Component {
	render() {
		return (
			<div>
				<Players />
				<Draw />
				<Card cardW={store.gameW.game.cardW} />
				<Clue />
				<LastRound />
			</div>
		);
	}
}

export default Main;
