import React from "react";

import { store, utils } from "../utils";
import { commercials } from "../utils/NewGame";

class Commercial extends React.Component {
	render() {
		if (utils.isMyTurn()) alert(commercials[store.gameW.game.commercial!]);
		switch (store.gameW.game.commercial) {
		}
		return null;
	}
}

export default Commercial;
