import React from "react";

import utils, { store } from "../../utils";
import { GodType } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class Astarte extends React.Component<{ god?: GodType }> {
	render() {
		if (!this.props.god) return null;
		return (
			<div className={styles.bubble} onClick={this.f}>
				Astarte: {this.props.god.extra}
			</div>
		);
	}

	f(e: React.MouseEvent) {
		if (!utils.isMyTurn()) return;
		if (!this.props.god!.extra) return;
		this.props.god!.extra--;
		utils.getMe().money++;
		store.update(`used ${this.props.god!.name}`);
		e.stopPropagation();
	}
}

export default Astarte;
