import React from "react";

import utils, { store } from "../../utils";

import styles from "../../../../../shared/styles.module.css";

class Astarte extends React.Component {
	render() {
		return (
			<div className={styles.bubble} onClick={this.f.bind(this)}>
				Astarte: {store.gameW.game.astarte || 0}
			</div>
		);
	}

	f(e: React.MouseEvent) {
		if (!utils.isMyTurn()) return;
		if (!store.gameW.game.astarte) return;
		store.gameW.game.astarte--;
		utils.getMe().money++;
		store.update("used Astarte");
		e.stopPropagation();
	}
}

export default Astarte;
