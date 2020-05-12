import React from "react";

import bank, { Color, CardType, Science, Upgrade } from "../utils/bank";
import { PlayerType } from "../utils/NewGame";

import styles from "../../../../shared/styles.module.css";
import { getScore } from "../utils";

class Player extends React.Component<{
	player: PlayerType;
	selected?: number;
	select?: (index: number) => void;
}> {
	render() {
		if (!this.props.player) return null;
		const classes = [styles.bubble];
		if (this.props.selected !== undefined) classes.push(styles.grey);
		return (
			<div>
				<div
					className={classes.join(" ")}
					onClick={() => this.props.select && this.props.select(-1)}
				>
					<h2>
						{this.props.player.userName} - $
						{this.props.player.money} -{" "}
						{getScore(this.props.player)}
					</h2>
					<div className={styles.flex}>
						{this.props.player.cards && this.renderCards()}
					</div>
				</div>
			</div>
		);
	}

	renderCards() {
		const cardsByColor: { [color in Color]?: CardType[] } = {};
		this.props.player.cards.forEach((cardIndex) => {
			const card = bank.cards[cardIndex];
			if (!cardsByColor[card.color]) cardsByColor[card.color] = [];
			cardsByColor[card.color]!.push(card);
		});
		return Object.entries(cardsByColor).map(([color, cards]) => {
			return (
				<div key={color} className={styles.bubble}>
					<div style={{ backgroundColor: color }}>_</div>
					{this.renderColorCards(color, cards!)}
				</div>
			);
		});
	}

	renderColorCards(color: string, cards: CardType[]) {
		var f: (card: CardType) => string = () => "";
		switch (color) {
			case Color.brown:
			case Color.grey:
				f = (card: CardType) => card.extra.resource!.join("");
				break;
			case Color.yellow:
				f = (card: CardType) =>
					[
						card.extra.discount &&
							`d: ${card.extra.discount.join("")}`,
						card.extra.resourceOptions &&
							`o: ${card.extra.resourceOptions.join("/")}`,
					].join(" - ");
				break;
			case Color.red:
				f = (card: CardType) => card.extra.military!.toLocaleString();
				break;
			case Color.blue:
				f = (card: CardType) => card.extra.points!.toLocaleString();
				break;
			case Color.green:
				f = (card: CardType) =>
					[Science[card.extra.science!], card.extra.points]
						.filter(Boolean)
						.join(" + ");
				break;
		}
		return cards.map((card) => (
			<pre key={card.name} title={JSON.stringify(card, null, 2)}>
				{[
					card.name,
					f(card),
					card.message,
					card.upgradesTo && Upgrade[card.upgradesTo],
				]
					.filter(Boolean)
					.join(" - ")}
			</pre>
		));
	}
}

export default Player;
