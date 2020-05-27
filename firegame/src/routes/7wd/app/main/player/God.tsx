import React from "react";
import { GodType } from "../../utils/types";

import utils, { store } from "../../utils/utils";

import styles from "../../../../../shared/styles.module.css";

class God extends React.Component<{ god: GodType }> {
	render() {
		return (
			<div className={styles.bubble} onClick={this.f.bind(this)}>
				{this.text()}
			</div>
		);
	}

	text() {
		const name = this.props.god.name;
		if (name === "astarte")
			return `${name}: ${store.gameW.game.astarte || 0}`;
		return name;
	}

	f(e: React.MouseEvent) {
		if (this.props.god.name !== "astarte") return;
		if (!utils.isMyTurn()) return;
		if (!store.gameW.game.astarte) return;
		store.gameW.game.astarte--;
		utils.getMe().money++;
		store.update("used Astarte");
		e.stopPropagation();
	}
}

export default God;
