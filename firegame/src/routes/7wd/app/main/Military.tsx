import React from "react";
import { utils, getMilitaryPoints } from "../utils";

import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";

const NUM_POSITIONS = 9;

class Military extends React.Component {
	render() {
		const militaryDiff =
			utils.getMe().military - utils.getOpponent().military;
		return (
			<div className={styles.bubble}>
				<h2>Military</h2>
				<div className={styles.flex}>
					{Array.from(new Array(NUM_POSITIONS * 2 + 1)).map(
						(_, index) => (
							<div
								key={index}
								className={`${css.military} ${styles.bubble}`}
							>
								<div>
									{this.getFill(
										militaryDiff,
										index - NUM_POSITIONS
									)}
									<br />
									{getMilitaryPoints(
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

	getFill(militaryDiff: number, index: number) {
		if (index === militaryDiff) return "x";
		const stars = (index > 0 ? utils.getMe() : utils.getOpponent())
			.militaryBonuses[Math.abs(index)];
		if (stars === 0) return "WIN";
		return "*".repeat(stars);
	}
}

export default Military;
