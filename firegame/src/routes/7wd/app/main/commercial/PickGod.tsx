import React from "react";

import utils, { store } from "../../utils/utils";
import bank from "../../utils/bank";

import styles from "../../../../../shared/styles.module.css";
import { God } from "../../utils/types";

const GODS_TO_DRAW = 2;

class PickGod extends React.Component<{
	reset: () => void;
	selectedPantheon?: number;
}> {
	render() {
		const god = store.gameW.game.godTokens[0];
		if (!utils.isMyTurn())
			return <div className={styles.bubble}>{God[god]}</div>;
		return (
			<div className={styles.bubble}>
				<div className={styles.flex}>
					{store.gameW.game.gods[god]
						.slice(0, GODS_TO_DRAW)
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
									const value = store.gameW.game.godTokens.shift()!;
									const selected = store.gameW.game.gods[
										value
									].splice(tokenIndex, 1)[0];
									store.gameW.game.pantheon[
										this.props.selectedPantheon
									] = selected;
									const me = utils.getMe();
									if (!me.tokens) me.tokens = [];
									me.tokens.push({
										value,
										isGod: true,
									});
									utils.endCommercial("placed a god");
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
