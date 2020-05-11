import React from "react";

import { store } from "../utils";
import bank from "../utils/bank";

import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";

class StructureCard extends React.Component<{
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
				onClick={this.select.bind(this)}
				style={{
					transform: this.getTransform(),
					visibility: this.props.taken ? "hidden" : "visible",
				}}
			>
				{JSON.stringify(this.props)}
			</div>
		);
	}

	getTransform() {
		const p = this.props.offset * 50;
		return `translate(${p}%, 0%)`;
	}

	select() {
		if (
			!StructureCard.canTake(
				this.props.y,
				this.props.x,
				this.props.offset
			)
		)
			return alert("cannot take that card");
		store.gameW.game.structure[this.props.y][this.props.x].taken = true;
		const rowAboveY = this.props.y - 1;
		const rowAbove = store.gameW.game.structure[rowAboveY];
		if (rowAbove)
			rowAbove.forEach(
				(card, index) =>
					StructureCard.canTake(rowAboveY, index, card.offset) &&
					(card.revealed = true)
			);
		store.update(
			`took ${
				bank.bank[store.gameW.game.age]![this.props.cardIndex].name
			}`
		);
	}

	static canTake(y: number, x: number, offset: number): boolean {
		const rowBelow = store.gameW.game.structure[y + 1];
		if (!rowBelow) return true;
		const gridX = x * 2 + offset;
		const cardsBelow = rowBelow.filter(
			(card, index) =>
				!card.taken && Math.abs(card.offset + index * 2 - gridX) === 1
		);
		return cardsBelow.length === 0;
	}
}

export default StructureCard;
