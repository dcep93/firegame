import React from "react";

import styles from "../../../../shared/styles.module.css";
import utils, { store } from "../utils/utils";
import { Level, Token } from "../utils/bank";

const NUM_BUYABLE = 4;

class Cards extends React.Component<{
	goldSelected: boolean;
	buyCard: (level: Level, index: number) => void;
}> {
	render() {
		return (
			<div className={styles.bubble}>
				{utils.enumArray(Level).map((l: Level) => {
					const deck = store.gameW.game.cards[l];
					return (
						<div key={l}>
							<div className={styles.bubble}>
								<div
									onClick={() => {
										if (!utils.isMyTurn()) return;
										this.reserve(
											l,
											NUM_BUYABLE,
											"face down card"
										);
									}}
								>
									Level {Level[l]}:{" "}
									{deck.length - NUM_BUYABLE}
								</div>
								{Array.from(new Array(NUM_BUYABLE))
									.map((_, index) => deck[index])
									.filter(Boolean)
									.map((card, index) => (
										<div
											key={index}
											onClick={() => {
												if (!utils.isMyTurn()) return;
												if (this.props.goldSelected) {
													this.reserve(
														l,
														index,
														"card"
													);
												} else {
													this.props.buyCard(
														l,
														index
													);
												}
											}}
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

	reserve(level: Level, index: number, msg: string) {
		utils.gainToken(Token.gold);
		const me = utils.getMe();
		if (!me.hand) me.hand = [];
		me.hand.push(store.gameW.game.cards[level].splice(index, 1)[0]);
		utils.finishTurn(`reserved a ${msg}`);
	}
}

export default Cards;
