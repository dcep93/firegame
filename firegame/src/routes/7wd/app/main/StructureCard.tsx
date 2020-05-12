import React from "react";

import { getCost } from "../utils";
import bank, { Upgrade } from "../utils/bank";

import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";

class StructureCard extends React.Component<{
	selectCard: (x: number, y: number, offset: number) => void;
	cardIndex: number;
	offset: number;
	revealed: boolean;
	taken: boolean;
	x: number;
	y: number;
}> {
	render() {
		return (
			<div
				className={`${css.structure_card} ${styles.bubble}`}
				onClick={() =>
					this.props.selectCard(
						this.props.x,
						this.props.y,
						this.props.offset
					)
				}
				style={{
					transform: this.getTransform(),
					visibility: this.props.taken ? "hidden" : "visible",
					zIndex: this.props.y,
				}}
			>
				{this.renderCard()}
			</div>
		);
	}

	renderCard() {
		if (!this.props.revealed) return "?";
		const card = bank.cards[this.props.cardIndex];
		return (
			<div>
				<div style={{ backgroundColor: card.color }}>_</div>
				<div>{card.name}</div>
				<pre>
					cost: {card.cost.join("")} (${getCost(card)})
				</pre>
				{card.upgradesFrom && (
					<div>from: {Upgrade[card.upgradesFrom]}</div>
				)}
				{card.upgradesTo && <div>to: {Upgrade[card.upgradesTo]}</div>}
			</div>
		);
	}

	getTransform() {
		const p = this.props.offset * 50;
		return `translate(${p}%, 0%)`;
	}
}

export default StructureCard;
