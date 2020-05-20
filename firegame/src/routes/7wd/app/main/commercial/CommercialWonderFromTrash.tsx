import React from "react";
import utils, { store } from "../../utils";
import bank from "../../utils/bank";

import styles from "../../../../../shared/styles.module.css";

class CommercialWonderFromTrash extends React.Component<
	{ pop: () => void },
	{ trashIndex: number }
> {
	render() {
		if (!utils.isMyTurn()) return null;
		const wonders = utils
			.getOpponent()
			.wonders.filter((wonder) => !wonder.built);
		if (!wonders) {
			this.props.pop();
			alert("no wonders to build");
			return null;
		}
		if (!store.gameW.game.trash) {
			this.props.pop();
			alert("no cards in trash");
			return null;
		}
		return (
			<div className={styles.bubble}>
				<h2>Steal Wonder</h2>
				<div className={styles.flex}>
					{store.gameW.game.trash!.map((trashIndex) => (
						<div
							key={trashIndex}
							title={JSON.stringify(
								bank.cards[trashIndex],
								null,
								2
							)}
							className={
								this.state?.trashIndex === trashIndex
									? styles.grey
									: ""
							}
							onClick={() => this.setState({ trashIndex })}
						>
							{bank.cards[trashIndex].name}
						</div>
					))}
					{wonders.map((pWonder) => (
						<div
							key={pWonder.wonderIndex}
							onClick={() => {
								if (!this.state)
									return alert(
										"pick a card from trash first"
									);
								store.gameW.game.trash!.splice(
									this.state.trashIndex,
									1
								);
								pWonder.built = true;
								const wonder =
									bank.wonders[pWonder.wonderIndex];
								if (wonder.goAgain) utils.incrementPlayerTurn();
								this.props.pop();
								store.update(`stole ${wonder.name}`);
							}}
						>
							{bank.wonders[pWonder.wonderIndex].name}
						</div>
					))}
					)}
				</div>
			</div>
		);
	}
}

export default CommercialWonderFromTrash;
