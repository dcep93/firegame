import React from "react";

import styles from "../../../../shared/styles.module.css";
import utils from "../utils/utils";
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
				<div>
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
				</div>
				<div>
					<div className={styles.bubble}>
						<h2>Tokens</h2>
						{(me.tokens || []).map((t, index) => (
							<div
								key={index}
								onClick={() => this.props.selectToken(index)}
								className={`${
									this.props.selectedTokens[index] &&
									styles.grey
								}`}
							>
								{Token[t]}
							</div>
						))}
					</div>
				</div>
			</>
		);
	}
}

export default Me;
