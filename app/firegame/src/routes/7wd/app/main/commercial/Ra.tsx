import React from "react";

import utils from "../../utils/utils";
import bank from "../../utils/bank";

import styles from "../../../../../shared/styles.module.css";

class Ra extends React.Component {
	render() {
		const wondersToSteal = utils
			.getPlayer(1 - utils.currentIndex())
			.wonders.map((wonder, index) => ({ wonder, index }))
			.filter((obj) => !obj.wonder.built);
		if (!wondersToSteal.length) {
			utils.endCommercial("could not steal a wonder");
			return;
		}
		return (
			<div className={styles.bubble}>
				<h2>Steal Wonder</h2>
				<div className={styles.flex}>
					{wondersToSteal.map((obj) => (
						<div
							key={obj.index}
							className={styles.bubble}
							onClick={() => {
								if (!utils.isMyTurn()) return;
								utils
									.getOpponent()
									.wonders.splice(obj.index, 1);
								utils.getMe().wonders.push(obj.wonder);
								utils.endCommercial(
									`stole ${
										bank.wonders[obj.wonder.wonderIndex]
											.name
									}`
								);
							}}
						>
							{bank.wonders[obj.wonder.wonderIndex].name}
						</div>
					))}
				</div>
			</div>
		);
	}
}

export default Ra;
