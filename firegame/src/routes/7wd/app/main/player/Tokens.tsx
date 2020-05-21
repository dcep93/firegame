import React from "react";
import { TokenType } from "../../utils/types";

import utils, { store } from "../../utils";

import styles from "../../../../../shared/styles.module.css";

class Tokens extends React.Component<{
	tokens: TokenType[];
	usedTokens?: { [tokenIndex: number]: boolean };
	discount: (tokenIndex: number) => void;
}> {
	render() {
		return (
			<div className={`${styles.flex} ${styles.bubble}`}>
				<div>Tokens:</div>
				{this.props.tokens.map((token, tokenIndex) => (
					<div
						key={tokenIndex}
						className={`${styles.bubble} ${
							(this.props.usedTokens || {})[tokenIndex] &&
							styles.grey
						}`}
						onClick={(e: React.MouseEvent) => {
							if (!utils.isMyTurn()) return;
							if (store.gameW.game.commercials) return;
							if (token.isGod) return;
							e.stopPropagation();
							this.props.discount(tokenIndex);
						}}
					>
						{token.value}
					</div>
				))}
			</div>
		);
	}
}

export default Tokens;
