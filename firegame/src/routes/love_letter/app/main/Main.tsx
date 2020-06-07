import React from "react";
import utils, { store } from "../utils/utils";

import Me from "./Me";
import Action from "./Action";
import TwoPlayerAside from "./TwoPlayerAside";

import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";

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
							} ${
								store.gameW.game.currentPlayer === index &&
								css.blue
							}`}
							title={
								p.played
									? Array.from(p.played)
											.reverse()
											.map(utils.cardString)
											.join("\n")
									: "NONE"
							}
						>
							{store.gameW.game.jester === index ? "(J) " : ""}
							{p.userName} - ({p.score})
						</div>
					))}
				</div>
				<h2>Deck: {store.gameW.game.deck?.length}</h2>
				<TwoPlayerAside />
			</div>
		);
	}
}

export default Main;
