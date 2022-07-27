import React from "react";

import utils, { store } from "../utils/utils";

class TwoPlayerAside extends React.Component {
	render() {
		if (!store.gameW.game.two_p_aside) return null;
		return (
			<div>
				<h2>Aside for two players:</h2>
				<div>
					{store.gameW.game.two_p_aside
						.map(utils.cardString)
						.join(" ")}
				</div>
			</div>
		);
	}
}

export default TwoPlayerAside;
