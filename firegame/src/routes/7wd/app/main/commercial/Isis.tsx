import React from "react";

import utils, { store } from "../../utils";
import bank from "../../utils/bank";

import styles from "../../../../../shared/styles.module.css";

class Isis extends React.Component<{}, { trashIndex: number }> {
	render() {
		if (!utils.isMyTurn()) return null;
		const wonders = utils
			.getOpponent()
			.wonders.filter((wonder) => !wonder.built);
		if (!wonders.length) {
			utils.endCommercial("no wonders to build");
			return null;
		}
		if (!store.gameW.game.trash) {
			utils.endCommercial("no cards in trash");
			return;
		}
		return (
			<div className={styles.bubble}>
				<h2>Steal Wonder</h2>
				<div className={styles.flex}>
					{store.gameW.game
						.trash!.map((trashIndex) => ({
							trashIndex,
							card: bank.cards[trashIndex],
						}))
						.map((obj) => (
							<div
								key={obj.trashIndex}
								title={JSON.stringify(obj.card, null, 2)}
								className={
									this.state?.trashIndex === obj.trashIndex
										? styles.grey
										: ""
								}
								onClick={() =>
									this.setState({
										trashIndex: obj.trashIndex,
									})
								}
							>
								{obj.card}
							</div>
						))}
					{wonders
						.map((pWonder) => ({
							pWonder,
							wonder: bank.wonders[pWonder.wonderIndex],
						}))
						.map((obj) => (
							<div
								key={obj.pWonder.wonderIndex}
								onClick={() => {
									if (!this.state)
										return alert(
											"pick a card from trash first"
										);
									store.gameW.game.trash!.splice(
										this.state.trashIndex,
										1
									);
									obj.pWonder.built = true;
									if (obj.wonder.goAgain)
										utils.incrementPlayerTurn();
									utils.endCommercial(
										`stole ${obj.wonder.name}`
									);
								}}
							>
								{obj.wonder.name}
							</div>
						))}
					)}
				</div>
			</div>
		);
	}
}

export default Isis;
