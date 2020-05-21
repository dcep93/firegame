import React from "react";
import { TokenType } from "../../utils/types";

import utils, { store } from "../../utils";

import styles from "../../../../../shared/styles.module.css";

class Tokens extends React.Component<{ tokens: TokenType[] }> {
	render() {
		return (
			<div className={`${styles.flex} ${styles.bubble}`}>
				<div>Tokens:</div>
				{this.props.tokens.map((token, tokenIndex) => (
					<div
						key={tokenIndex}
						className={styles.bubble}
						onClick={() => {
							if (!utils.isMyTurn()) return;
							if (store.gameW.game.commercials) return;
							if (token.isGod) return;
							utils.getMe().money += token.value as number;
							utils.getMe().tokens?.splice(tokenIndex, 1);
							alert("todo force only use on gods");
							store.update(`discounts ${token.value}`);
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
