import React from "react";

import utils, { store } from "../utils";
import { CommercialEnum, PlayerType } from "../utils/types";

import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";

const NUM_POSITIONS = 9;

class Military extends React.Component<{ players: PlayerType[] }> {
	render() {
		const militaryDiff =
			this.props.players[0].military - this.props.players[1].military;
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
										militaryDiff,
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
		store.gameW.game.minerva =
			this.props.players[0].index === 0 ? index : -index;
		utils.endCommercial(`placed Minerva`);
	}

	getFill(militaryDiff: number, index: number) {
		if (index === militaryDiff) return "x";
		const stars = (this.props.players[index > 0 ? 0 : 1].militaryBonuses ||
			[])[Math.abs(index)];
		if (stars === 0) return index > 0 ? "WIN" : "LOSE";
		const s = "*".repeat(stars);
		const m =
			(this.props.players[0].index === 0 ? index : -index) ===
			store.gameW.game.minerva
				? " M"
				: "";
		return s + m;
	}
}

export default Military;
