import React from "react";

import utils, { store } from "../../utils";
import bank from "../../utils/bank";
import { CommercialType } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class PickGod extends React.Component<{
	commercial: CommercialType;
	pop: () => void;
	reset: () => void;
	selectedPantheon?: number;
}> {
	render() {
		if (!utils.isMyTurn()) return null;
		return (
			<div className={styles.bubble}>
				<div className={styles.flex}>
					{store.gameW.game.gods[store.gameW.game.godTokens[0]]
						.slice(0, 2)
						.map((godIndex, tokenIndex) => (
							<div
								key={tokenIndex}
								onClick={() => {
									if (!utils.isMyTurn()) return;
									if (
										this.props.selectedPantheon ===
										undefined
									)
										return alert(
											"need to select a target first"
										);
									const selected = store.gameW.game.gods[
										store.gameW.game.godTokens[0]
									].splice(tokenIndex, 1)[0];
									store.gameW.game.pantheon[
										this.props.selectedPantheon
									] = selected;
									const me = utils.getMe();
									if (!me.tokens) me.tokens = [];
									me.tokens.push({
										value: store.gameW.game.godTokens.shift()!,
										isGod: true,
									});
									this.props.pop();
									store.update("placed a god");
									this.props.reset();
								}}
								className={styles.bubble}
								title={JSON.stringify(
									bank.gods[godIndex],
									null,
									2
								)}
							>
								<p>{bank.gods[godIndex].name}</p>
								<p>{bank.gods[godIndex].message}</p>
							</div>
						))}
				</div>
			</div>
		);
	}
}

export default PickGod;
