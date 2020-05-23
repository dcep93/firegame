import React from "react";

import utils, { store } from "../utils/utils";
import { CommercialEnum, PlayerType } from "../utils/types";

import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";

const NUM_POSITIONS = 9;

class Military extends React.Component<{ players: PlayerType[] }> {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Military</h2>
				<div className={styles.flex}>
					{Array.from(new Array(NUM_POSITIONS * 2 + 1)).map(
						(_, index) => (
							<div
								key={index}
								className={`${css.military} ${styles.bubble}`}
								onClick={() =>
									this.minerva(index - NUM_POSITIONS)
								}
							>
								<div>
									{this.getFill(
										store.gameW.game.military,
										index - NUM_POSITIONS
									)}
									<br />
									{utils.getMilitaryPoints(
										Math.abs(index - NUM_POSITIONS)
									)}
								</div>
							</div>
						)
					)}
				</div>
			</div>
		);
	}

	minerva(index: number) {
		if (!utils.isMyCommercial(CommercialEnum.minerva)) return;
		store.gameW.game.minerva = index;
		utils.endCommercial(`placed Minerva`);
	}

	getFill(militaryDiff: number, index: number) {
		if (index === militaryDiff) return "x";
		const stars =
			store.gameW.game.players[index > 0 ? 0 : 1].militaryBonuses[
				Math.abs(index)
			];
		if (stars === 0)
			return index * (utils.myIndex() - 0.5) > 0 ? "LOSE" : "WIN";
		const s = "*".repeat(stars);
		const m = index === store.gameW.game.minerva ? " M" : "";
		return s + m;
	}
}

export default Military;
