import React from "react";

import utils from "../../utils/utils";
import bank from "../../utils/bank";
import { Color } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class Nisaba extends React.Component {
	render() {
		const sciences = (
			utils.getPlayer(1 - utils.currentIndex()).cards || []
		).filter((cardIndex) => bank.cards[cardIndex].color === Color.green);
		if (!sciences.length) {
			utils.endCommercial("no sciences to copy");
			return;
		}
		return (
			<div className={styles.bubble}>
				<h2>Copy Science</h2>
				<div className={styles.flex}>
					{sciences
						.map((index) => ({ index, card: bank.cards[index] }))
						.map((obj) => (
							<div
								key={obj.index}
								onClick={() => {
									if (!utils.isMyTurn()) return;
									const science = obj.card.extra.science!;
									utils.gainScience(science);
									utils.endCommercial(`copied ${science}`);
								}}
							>
								{/* todo show science name */}
								{obj.card.extra.science}
							</div>
						))}
				</div>
			</div>
		);
	}
}

export default Nisaba;
