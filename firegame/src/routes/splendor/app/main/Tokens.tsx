import React from "react";

import styles from "../../../../shared/styles.module.css";
import utils, { store } from "../utils/utils";
import { Token, TokenToEmoji } from "../utils/bank";

type PropsType = {
	goldSelected: boolean;
	selectGold: (force: boolean) => void;
};

class Tokens extends React.Component<PropsType, { [t in Token]?: boolean }> {
	constructor(props: PropsType) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className={styles.bubble}>
				<h2>Bank</h2>
				<div>
					{Object.keys(store.gameW.game.tokens)
						.map((t) => parseInt(t))
						.map(
							(token) =>
								token !== Token.gold && (
									<div
										onClick={() => this.select(token)}
										key={token}
										className={`${
											this.isSelected(token) &&
											styles.grey
										}`}
									>
										{this.renderToken(token)}
									</div>
								)
						)}
					<button onClick={this.take.bind(this)}>Take</button>
					<div
						onClick={() => this.selectGold(true)}
						className={`${this.props.goldSelected && styles.grey}`}
					>
						{this.renderToken(Token.gold)}
					</div>
				</div>
			</div>
		);
	}

	renderToken(token: Token) {
		return `${TokenToEmoji[token!]}: ${store.gameW.game.tokens[token]}`;
	}

	select(token: Token) {
		this.selectGold(false);
		const MAX_TOKENS = 3;
		if (!this.isSelected(token)) {
			if (
				Object.values(this.state).filter(Boolean).length === MAX_TOKENS
			) {
				alert(`Can only select ${MAX_TOKENS} tokens`);
				return;
			}
		}
		this.setState({ [token]: !this.isSelected(token) });
	}

	selectGold(allowSelect: boolean) {
		this.props.selectGold(allowSelect);
		if (allowSelect) this.clearSelect();
	}

	clearSelect() {
		const s: { [n: number]: boolean } = {};
		Object.keys(this.state)
			.map((t) => parseInt(t))
			.forEach((t) => (s[t] = false));
		this.setState(s);
	}

	isSelected(token: Token) {
		if (token === Token.gold) return this.props.goldSelected;
		return this.state[token];
	}

	take() {
		if (!utils.isMyTurn()) return;
		if (this.props.goldSelected) {
			alert("To take a gold, reserve a card.");
			return;
		}
		const toTake: Token[] = Object.entries(this.state)
			.map(([token, selected]) => ({
				token: parseInt(token),
				selected,
			}))
			.filter((obj) => obj.selected)
			.map((obj) => obj.token);
		var num: number;
		var min: number;
		if (toTake.length === 1) {
			const MIN_TO_TAKE_2 = 6;
			num = 2;
			min = MIN_TO_TAKE_2;
		} else if (toTake.length === 3) {
			num = 1;
			min = 1;
		} else {
			alert("Need to select either 1 or 3 token types.");
			return;
		}
		var allowed = true;
		toTake.forEach(
			(t) => (allowed = allowed && store.gameW.game.tokens[t]! >= min)
		);
		if (!allowed) {
			alert("Not allowed");
			return;
		}
		toTake.forEach((t) => utils.gainToken(t, num));
		utils.getMe().tokens!.sort();
		this.clearSelect();
		utils.finishTurn(
			`took ${toTake.map((t) => TokenToEmoji[t]).join(", ")}`
		);
	}
}

export default Tokens;
