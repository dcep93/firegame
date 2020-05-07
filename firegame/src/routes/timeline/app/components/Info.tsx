import React from "react";
import { GameType } from "./Render";

import styles from "../../../../shared/css/Styles.module.css";

class Info extends React.Component<{ game: GameType }> {
	render() {
		return (
			<div className={styles.bubble}>
				<p>{this.props.game.title}</p>
				<p>
					Set Id: <span>{this.props.game.setId}</span>
				</p>
				<p>
					Current Player:{" "}
					<span>
						{
							this.props.game.players[
								this.props.game.currentPlayer
							].username
						}
					</span>
				</p>
			</div>
		);
	}
}

export default Info;
