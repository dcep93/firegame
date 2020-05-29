import React from "react";

import utils, { store } from "../../utils/utils";
import bank from "../../utils/bank";
import { Color } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class Isis extends React.Component<{}, { trashIndex: number }> {
	render() {
		if (!utils.isMyTurn()) return null;
		const wonders = utils.getMe().wonders.filter((wonder) => !wonder.built);
		if (!wonders.length) {
			utils.endCommercial("no wonders to build");
			return null;
		}
		if (!store.gameW.game.trash) {
			utils.endCommercial("no cards in trash");
			return null;
		}
		return (
			<div className={styles.bubble}>
				<div>
					<h2>Build Wonder</h2>
					<div>
						{wonders
							.map((pWonder) => ({
								pWonder,
								wonder: bank.wonders[pWonder.wonderIndex],
							}))
							.map((obj) => (
								<div
									className={styles.bubble}
									key={obj.pWonder.wonderIndex}
									onClick={() => {
										if (!utils.isMyTurn()) return;
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
									title={JSON.stringify(obj.wonder, null, 2)}
								>
									{obj.wonder.name}
								</div>
							))}
					</div>
					<div>
						<h2>Trash Cards</h2>
						{store.gameW.game
							.trash!.map((trashIndex) => ({
								trashIndex,
								card: bank.cards[trashIndex],
							}))
							.map((obj) => (
								<div
									key={obj.trashIndex}
									title={JSON.stringify(obj.card, null, 2)}
									className={`${styles.bubble} ${
										this.state?.trashIndex ===
										obj.trashIndex
											? styles.grey
											: ""
									}`}
									onClick={() =>
										this.setState({
											trashIndex:
												obj.trashIndex ===
												this.state?.trashIndex
													? -1
													: obj.trashIndex,
										})
									}
								>
									<div
										style={{
											backgroundColor:
												Color[obj.card.color],
										}}
									>
										_
									</div>
									{obj.card.name}
								</div>
							))}
					</div>
				</div>
			</div>
		);
	}
}

export default Isis;
