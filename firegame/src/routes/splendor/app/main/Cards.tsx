import React from "react";

import styles from "../../../../shared/styles.module.css";
import utils, { store } from "../utils/utils";
import { Level, Token } from "../utils/bank";

const NUM_BUYABLE = 4;

class Cards extends React.Component {
	render() {
		return (
			<div className={styles.bubble}>
				{utils.enumArray(Level).map((l) => {
					const deck = store.gameW.game.cards[l];
					return (
						<div key={l}>
							<div className={styles.bubble}>
								<div>
									Level {Level[l]}:{" "}
									{deck.length - NUM_BUYABLE}
								</div>
								{Array.from(new Array(NUM_BUYABLE))
									.map((_, index) => deck[index])
									.filter(Boolean)
									.map((card, index) => (
										<div
											key={index}
											onClick={() =>
												alert(`${l} ${index}`)
											}
										>
											{Token[card.color]} - ({card.points}
											) :{" "}
											{Object.entries(card.price)
												.map(
													([t, n]) =>
														`${
															Token[parseInt(t)]
														} x${n}`
												)
												.join(" ")}
										</div>
									))}
							</div>
						</div>
					);
				})}
			</div>
		);
	}
}

export default Cards;
