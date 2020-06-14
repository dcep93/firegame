import React from "react";

import styles from "../../../../shared/styles.module.css";
import utils, { store } from "../utils/utils";
import { Level, Token } from "../utils/bank";

const NUM_BUYABLE = 4;

class Cards extends React.Component<{
	goldSelected: boolean;
	buyCard: (level: Level, index: number) => void;
	selectGold: () => void;
}> {
	render() {
		return (
			<div>
				<div className={styles.bubble}>
					<h2>Board</h2>
					{utils.enumArray(Level).map((l: Level) => {
						const deck = store.gameW.game.cards[l];
						return (
							deck && (
								<div key={l}>
									<div className={styles.bubble}>
										<h5
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
										</h5>
										{Array.from(new Array(NUM_BUYABLE))
											.map((_, index) => deck[index])
											.filter(Boolean)
											.map((card, index) => (
												<div
													key={index}
													onClick={() => {
														if (!utils.isMyTurn())
															return;
														if (
															this.props
																.goldSelected
														) {
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
													{utils.cardString(card)}
												</div>
											))}
									</div>
								</div>
							)
						);
					})}
				</div>
			</div>
		);
	}

	reserve(level: Level, index: number, msg: string) {
		const me = utils.getMe();
		if (!me.hand) me.hand = [];
		const MAX_HAND_SIZE = 3;
		if (me.hand.length === MAX_HAND_SIZE) {
			alert(`Already have ${MAX_HAND_SIZE} cards`);
			return;
		}
		this.props.selectGold();
		utils.gainToken(Token.gold);
		const card = store.gameW.game.cards[level]!.splice(index, 1)[0];
		if (!card) return;
		me.hand.push(card);
		utils.finishTurn(`reserved a ${msg}`);
	}
}

export default Cards;
