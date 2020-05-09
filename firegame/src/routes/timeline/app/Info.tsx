import React from "react";
import { GameType } from "./Render";

import styles from "../../../shared/styles.module.css";
import css from "./index.module.css";
import Store from "../../../shared/store";

class Info extends React.Component {
	render() {
		const game: GameType = Store.gameW.game;
		return (
			<div className={styles.bubble}>
				<div className={css.info}>
					<p>{game.title}</p>
					<p>
						Set Id: <span>{game.setId}</span>
					</p>
					<p>
						Current Player:{" "}
						<span>{game.players[game.currentPlayer].username}</span>
					</p>
					<div>
						{game.players.map((player) => (
							<p key={player.index}>
								{player.username} ({player.hand.length})
							</p>
						))}
					</div>
				</div>
			</div>
		);
	}
}

export default Info;
