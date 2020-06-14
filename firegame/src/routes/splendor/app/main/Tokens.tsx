import React from "react";

import styles from "../../../../shared/styles.module.css";
import { store } from "../utils/utils";
import { Token } from "../utils/bank";

type PropsType = {
	goldSelected?: boolean;
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
					{Object.entries(store.gameW.game.tokens)
						.map(([token, count]) => ({
							token: parseInt(token)!,
							count,
						}))
						.map(({ token, count }) => (
							<div
								onClick={() => this.select(token)}
								key={token}
								className={`${
									this.isSelected(token) && styles.grey
								}`}
							>
								{Token[token!]}: {count}
							</div>
						))}
				</div>
			</div>
		);
	}

	select(token: Token, force: boolean = false) {
		if (token === Token.gold) {
			this.props.selectGold(force);
			if (!force) {
				const s: { [n: number]: boolean } = {};
				Object.keys(this.state)
					.map((t) => parseInt(t))
					.forEach((t) => (s[t] = false));
				this.setState(s);
			}
			return;
		}
		this.select(Token.gold, true);
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

	isSelected(token: Token) {
		if (token === Token.gold) return this.props.goldSelected;
		return this.state[token];
	}
}

export default Tokens;
