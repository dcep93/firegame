import React from "react";

import styles from "../../../../shared/styles.module.css";
import utils, { store } from "../utils/utils";
import { Token, TokensGroup } from "../utils/bank";

class Players extends React.Component {
	render() {
		return (
			<div>
				<div className={styles.bubble}>
					<h2>Players</h2>
					{store.gameW.game.players.map((p, index) => (
						<div key={index}>
							<div className={styles.bubble}>
								<h5 title={this.tokensString(p.tokens || [])}>
									{p.userName} - {utils.getScore(p)} points
									{" / "}
									{(p.hand || []).length} hand / {p.nobles}{" "}
									nobles
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

	tokensString(tokens: Token[]) {
		const count: TokensGroup = {};
		tokens.forEach((t) => (count[t] = 1 + (count[t] || 0)));
		return Object.keys(count)
			.map((t) => parseInt(t))
			.map((t: Token) => `${Token[t]} x${count[t]}`)
			.join(" / ");
	}
}

export default Players;
