import React from "react";
import { store } from "../utils/utils";

import Me from "./Me";
import Action from "./Action";

import styles from "../../../../shared/styles.module.css";

class Main extends React.Component {
	render() {
		return (
			<div className={styles.bubble}>
				<Action />
				<Me />
				<div className={styles.flex}>
					<h2>Suitors:</h2>
					{store.gameW.game.players.map((p, index) => (
						<div
							key={index}
							className={`${styles.bubble} ${
								p.hand === undefined && styles.grey
							}`}
						>
							{p.userName}
						</div>
					))}
				</div>
				<h2>Deck: {store.gameW.game.deck.length}</h2>
			</div>
		);
	}
}

export default Main;
