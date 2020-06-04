import React from "react";
import utils, { store } from "../utils/utils";

import Me from "./Me";
import Action from "./Action";

import styles from "../../../../shared/styles.module.css";

class Main extends React.Component {
	render() {
		const info = store.gameW.info;
		return (
			<div className={styles.bubble}>
				<h2>
					[{info.playerName}] {info.message}
				</h2>
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
							title={(p.played || [])
								.map(utils.cardString)
								.join("\n")}
						>
							{p.userName} - ({p.score})
						</div>
					))}
				</div>
				<h2>Deck: {store.gameW.game.deck.length}</h2>
			</div>
		);
	}
}

export default Main;
