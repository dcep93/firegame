import React from "react";
import { store } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";

class Main extends React.Component {
	render() {
		return (
			<div>
				{store.gameW.game.players.map((p, index) => (
					<div
						className={`${styles.bubble} ${
							store.gameW.game.currentPlayer === index &&
							styles.blue
						}`}
						key={index}
					>
						<h2>{p.userName}</h2>
					</div>
				))}
			</div>
		);
	}
}

export default Main;
