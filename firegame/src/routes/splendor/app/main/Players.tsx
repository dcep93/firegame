import React from "react";

import styles from "../../../../shared/styles.module.css";
import utils, { store } from "../utils/utils";
import { Token, TokensGroup, TokenToEmoji } from "../utils/bank";

class Players extends React.Component {
	render() {
		return (
			<div>
				<div className={styles.bubble}>
					<h2>Players</h2>
					<div className={styles.flex}>
						{store.gameW.game.players.map((p, index) => (
							<div key={index}>
								<div className={styles.bubble}>
									<h5
										title={this.tokensString(
											p.tokens || []
										)}
									>
										{p.userName} - {utils.getScore(p)}{" "}
										points
										{" / "}
										{(p.hand || []).length} hand /{" "}
										{p.nobles} nobles
									</h5>
									{(p.cards || []).map((c, index) => (
										<div key={index}>
											{TokenToEmoji[c.color]} - (
											{c.points})
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	tokensString(tokens: Token[]) {
		const count: TokensGroup = {};
		tokens.forEach((t) => (count[t] = 1 + (count[t] || 0)));
		return Object.keys(count)
			.map((t) => parseInt(t))
			.map((t: Token) => `${TokenToEmoji[t]} x${count[t]}`)
			.join(" / ");
	}
}

export default Players;
