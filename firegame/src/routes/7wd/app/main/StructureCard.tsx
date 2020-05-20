import React from "react";

import utils, { store } from "../utils";

import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";
import {
	Age,
	Color,
	Upgrade,
	CardType,
	ScienceEnum,
	God,
} from "../utils/types";
import bank from "../utils/bank";

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
		if (!this.props.revealed) {
			if (store.gameW.game.params.godExpansion) {
				if (store.gameW.game.age === Age.one) {
					if (this.props.x % 2 === 0) {
						return "token";
					}
				} else if (store.gameW.game.age) {
					if (this.props.x % 2 === 0 && this.props.y === 1) {
						return "token";
					}
				}
			}
			return "?";
		}
		const card = bank.cards[this.props.cardIndex];
		return (
			<div title={JSON.stringify(card, null, 2)}>
				<div style={{ backgroundColor: Color[card.color] }}>_</div>
				<div>{card.name}</div>
				<div>
					cost: {card.cost.join("")} (${utils.getCardCost(card)})
				</div>
				{this.renderExtra(card)}
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

	renderExtra(card: CardType) {
		return (
			<>
				{card.message && <div>{card.message}</div>}
				{card.extra.resource && (
					<div>({card.extra.resource!.join("")})</div>
				)}
				{card.extra.resourceOptions && (
					<div>({card.extra.resourceOptions!.join("/")})</div>
				)}
				{card.extra.discount && (
					<div>d: ({card.extra.discount!.join("")})</div>
				)}
				{card.extra.points && <div>{card.extra.points} points</div>}
				{card.extra.military && (
					<div>military: {card.extra.military}</div>
				)}
				{card.extra.science !== undefined && (
					<div>symbol: {ScienceEnum[card.extra.science]}</div>
				)}
				{card.extra.godUpgrade && (
					<div>{God[card.extra.godUpgrade]}</div>
				)}
			</>
		);
	}
}

export default StructureCard;
