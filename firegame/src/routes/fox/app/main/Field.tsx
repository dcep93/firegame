import React from "react";

import { store, getText } from "../utils";

import styles from "../../../../shared/styles.module.css";

class Field extends React.Component {
	render() {
		const l = store.gameW.game.lead || { suit: "-", value: 0 };
		return (
			<div>
				<div className={styles.bubble}>
					<p>Trump</p>
					<p>{getText(store.gameW.game.trump)}</p>
				</div>
				<div className={styles.bubble}>
					<p>Lead</p>
					<p>{getText(l)}</p>
				</div>
				<div className={styles.bubble}>
					<p>Last</p>
					<p>{store.gameW.game.previous}</p>
				</div>
			</div>
		);
	}
}

export default Field;
