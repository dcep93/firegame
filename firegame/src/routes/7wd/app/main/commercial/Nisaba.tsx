import React from "react";

import utils, { store } from "../../utils";
import bank from "../../utils/bank";
import { CommercialType, Color } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class Nisaba extends React.Component<{
	commercial: CommercialType;
	pop: () => void;
}> {
	render() {
		// todo make this work with a sciences dict
		const sciences = utils
			.getOpponent()
			.cards?.filter(
				(cardIndex) => bank.cards[cardIndex].color === Color.green
			);
		if (!sciences) {
			if (utils.isMyTurn()) {
				this.props.pop();
				store.update("no sciences to copy");
			}
			return;
		}
		return (
			<div className={styles.bubble}>
				<h2>Copy Science</h2>
				<div className={styles.flex}>
					{sciences.map((index) => (
						<div
							key={index}
							onClick={() => {
								if (!utils.isMyTurn()) return;
								this.props.pop();
								store.update(
									`copied ${bank.cards[index].extra.science}`
								);
							}}
						>
							{bank.cards[index].extra.science}
						</div>
					))}
					)}
				</div>
			</div>
		);
	}
}

export default Nisaba;
