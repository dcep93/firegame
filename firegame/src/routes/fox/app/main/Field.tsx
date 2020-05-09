import React from "react";

import { store } from "../utils";

import styles from "../../../../shared/styles.module.css";

class Field extends React.Component {
	render() {
		const t = store.gameW.game.trump;
		const l = store.gameW.game.lead || { suit: "-", value: "-" };
		return (
			<div>
				<div className={styles.bubble}>
					<p>Trump</p>
					<p>
						{t.suit}/{t.value}
					</p>
				</div>
				<div className={styles.bubble}>
					<p>Lead</p>
					<p>
						{l.suit}/{l.value}
					</p>
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
