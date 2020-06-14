import React from "react";

import styles from "../../../../shared/styles.module.css";
import { store } from "../utils/utils";
import { Token } from "../utils/bank";

class Nobles extends React.Component {
	render() {
		const nobles = store.gameW.game.nobles;
		if (!nobles) return null;
		return (
			<div>
				<div className={styles.bubble}>
					<h2>Nobles</h2>
					{nobles.map((n, index) => (
						<div key={index}>
							{Object.entries(n)
								.map(([token, count]) => ({
									token: parseInt(token),
									count,
								}))
								.map(
									({ token, count }) =>
										`${Token[token]}: ${count}`
								)
								.join(" ")}
						</div>
					))}
				</div>
			</div>
		);
	}
}

export default Nobles;
