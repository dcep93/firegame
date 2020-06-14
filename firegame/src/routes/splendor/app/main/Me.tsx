import React from "react";

import styles from "../../../../shared/styles.module.css";
import utils, { store, MAX_HAND_TOKENS } from "../utils/utils";
import { TokenToEmoji } from "../utils/bank";

class Me extends React.Component<{
	selectedTokens: { [n: number]: boolean };
	selectToken: (index: number) => void;
	buyHandCard: (index: number) => void;
}> {
	render() {
		const me = utils.getMe();
		if (!me) return null;
		return (
			<>
				<div className={styles.bubble}>
					<h2>Tokens</h2>
					{me.cards && (
						<div className={styles.bubble}>
							{me.cards.map((c) => TokenToEmoji[c.color]).sort()}
						</div>
					)}
					{this.mustDiscard() && <h2>Must Discard</h2>}
					{(me.tokens || []).map((t, index) => (
						<div
							key={index}
							onClick={() => this.selectToken(index)}
							className={`${
								this.props.selectedTokens[index] && styles.grey
							}`}
						>
							{TokenToEmoji[t]}
						</div>
					))}
				</div>
				<div className={styles.bubble}>
					<h2>Hand</h2>
					{(me.hand || []).map((c, index) => (
						<div
							key={index}
							onClick={() => this.props.buyHandCard(index)}
						>
							{utils.cardString(c)}
						</div>
					))}
				</div>
			</>
		);
	}

	selectToken(index: number) {
		if (this.mustDiscard()) {
			const tokens = utils.getMe().tokens!;
			const token = tokens.splice(index, 1)[0]!;
			if (tokens.length < MAX_HAND_TOKENS) {
				delete store.gameW.game.tooManyTokens;
				utils.incrementPlayerTurn();
			}
			store.update(`discarded ${TokenToEmoji[token]}`);
			return;
		}
		this.props.selectToken(index);
	}

	mustDiscard() {
		return utils.isMyTurn() && store.gameW.game.tooManyTokens;
	}
}

export default Me;
