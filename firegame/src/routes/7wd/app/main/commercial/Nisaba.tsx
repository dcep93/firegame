import React from "react";

import utils from "../../utils/utils";
import bank from "../../utils/bank";
import { Color, ScienceEnum } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class Nisaba extends React.Component {
	render() {
		const sciences = (
			utils.getPlayer(1 - utils.currentIndex()).cards || []
		).filter((cardIndex) => bank.cards[cardIndex].color === Color.green);
		if (!sciences.length) {
			if (utils.isMyTurn()) utils.endCommercial("no sciences to copy");
			return null;
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
									utils.endCommercial(
										`copied ${ScienceEnum[science]}`
									);
								}}
							>
								{ScienceEnum[obj.card.extra.science!]}
							</div>
						))}
				</div>
			</div>
		);
	}
}

export default Nisaba;
