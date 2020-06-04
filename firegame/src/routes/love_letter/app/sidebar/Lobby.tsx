import React from "react";

import { store } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";

class Lobby extends React.Component {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Lobby</h2>
				{Object.values(store.lobby).map((player) => (
					<div>{player}</div>
				))}
			</div>
		);
	}
}

export default Lobby;
