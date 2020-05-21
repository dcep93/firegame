import React from "react";

import utils from "../../utils";
import bank from "../../utils/bank";
import { CardType, Color, ScienceEnum, Upgrade } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class Cards extends React.Component<{ cards: number[] }> {
	render() {
		const cardsByColor = utils.arrToDict(
			this.props.cards.map((cardIndex) => bank.cards[cardIndex]),
			(card) => card.color.toString()
		);
		return Object.entries(cardsByColor).map(([color, cards]) => {
			return (
				<div key={Color[parseInt(color)]} className={styles.bubble}>
					<div style={{ backgroundColor: color }}>_</div>
					{this.renderColorCards(parseInt(color), cards!)}
				</div>
			);
		});
	}

	renderColorCards(color: Color, cards: CardType[]) {
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
					]
						.filter(Boolean)
						.join(" - ");
				break;
			case Color.red:
				f = (card: CardType) => card.extra.military!.toLocaleString();
				break;
			case Color.blue:
				f = (card: CardType) => card.extra.points!.toLocaleString();
				break;
			case Color.green:
				f = (card: CardType) =>
					[ScienceEnum[card.extra.science!], card.extra.points]
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

export default Cards;
