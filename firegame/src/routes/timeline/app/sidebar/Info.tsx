import React from "react";

import { store } from "../utils";
import { GameType } from "../utils/NewGame";

import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";

class Info extends React.Component {
	// todo should this be combined with players
	render() {
		const game: GameType = store.gameW.game!;
		return (
			<div className={styles.bubble}>
				<div className={css.info}>
					<p>{game.title}</p>
					<p>
						Set Id: <span>{game.setId}</span>
					</p>
					<p>
						Current Player:{" "}
						<span>{game.players[game.currentPlayer].userName}</span>
					</p>
					<div>
						{game.players.map((player) => (
							<p key={player.index}>
								{player.userName} ({player.hand.length})
							</p>
						))}
					</div>
				</div>
			</div>
		);
	}
}

export default Info;
