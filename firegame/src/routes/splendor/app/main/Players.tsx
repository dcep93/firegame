import React from "react";

import styles from "../../../../shared/styles.module.css";
import utils, { store } from "../utils/utils";

class Players extends React.Component {
	render() {
		return (
			<div>
				<div className={styles.bubble}>
					<h2>Players</h2>
					{store.gameW.game.players.map((p, index) => (
						<div key={index}>
							<div className={styles.bubble}>
								<h5>
									{p.userName} - {utils.getScore(p)} points
									{" / "}
									{p.nobles} nobles
								</h5>
								{(p.hand || []).map((c, index) => (
									<div key={index}>{utils.cardString(c)}</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}
}

export default Players;
