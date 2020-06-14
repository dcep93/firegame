import React from "react";

import styles from "../../../../shared/styles.module.css";
import utils, { store } from "../utils/utils";
import { Token } from "../utils/bank";

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
					{this.mustDiscard() && <h2>Must Discard</h2>}
					{(me.tokens || []).map((t, index) => (
						<div
							key={index}
							onClick={() => this.selectToken(index)}
							className={`${
								this.props.selectedTokens[index] && styles.grey
							}`}
						>
							{Token[t]}
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
			const token = utils.getMe().tokens!.splice(index, 1)[0]!;
			store.update(`discarded ${Token[token]}`);
			return;
		}
		this.props.selectToken(index);
	}

	mustDiscard() {
		return utils.isMyTurn() && store.gameW.game.tooManyTokens;
	}
}

export default Me;
