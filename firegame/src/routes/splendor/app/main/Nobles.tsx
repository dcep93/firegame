import React from "react";

import styles from "../../../../shared/styles.module.css";
import { store } from "../utils/utils";
import { Token, TokenToEmoji } from "../utils/bank";

class Nobles extends React.Component {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Nobles</h2>
				{(store.gameW.game.nobles || []).map((n, index) => (
					<div key={index}>
						<div className={styles.bubble}>
							{Object.entries(n)
								.map(([token, count]) => ({
									token: parseInt(token) as Token,
									count,
								}))
								.map(
									({ token, count }) =>
										`${TokenToEmoji[token]}: ${count}`
								)
								.join(" ")}
						</div>
					</div>
				))}
			</div>
		);
	}
}

export default Nobles;
