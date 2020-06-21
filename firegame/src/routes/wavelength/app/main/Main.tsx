import React from "react";

import Players from "./Players";
import Draw from "./Draw";
import Card from "./Card";
import Clue from "./Clue";

class Main extends React.Component {
	render() {
		return (
			<div>
				<Players />
				<Draw />
				<Card />
				<Clue />
			</div>
		);
	}
}

export default Main;
