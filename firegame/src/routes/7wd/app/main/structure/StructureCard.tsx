import React from "react";

import utils, { store } from "../../utils";
import bank from "../../utils/bank";
import {
	Age,
	Color,
	Upgrade,
	CardType,
	ScienceEnum,
	God,
} from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";
import css from "../../index.module.css";

class StructureCard extends React.Component<{
	selectCard: (x: number, y: number, offset: number) => void;
	cardIndex: number;
	revealed: boolean;
	taken: boolean;
	x: number;
	y: number;
	offset: number;
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
					transform: `translate(${this.props.offset * 50}%, 0%)`,
					visibility: this.props.taken ? "hidden" : "visible",
					zIndex: this.props.y,
				}}
			>
				{this.renderCard()}
			</div>
		);
	}

	renderCard() {
		const card = bank.cards[this.props.cardIndex];
		if (!this.props.revealed) {
			if (store.gameW.game.params.godExpansion) {
				if (store.gameW.game.age === Age.one) {
					if (this.props.x % 2 === 0) {
						return "god token";
					}
				} else if (store.gameW.game.age === Age.two) {
					if (this.props.x % 2 === 0 && this.props.y === 1) {
						return "discount token";
					}
				} else if (card.age !== Age.three) {
					return Age[card.age];
				}
			}
			return "?";
		}
		return (
			<div title={JSON.stringify(card, null, 2)}>
				<div style={{ backgroundColor: Color[card.color] }}>_</div>
				<div>{card.name}</div>
				<div>
					cost: {card.cost.join("")} ($
					{utils.getCardCost(
						card,
						utils.getMe() || utils.getCurrent()
					)}
					)
				</div>
				{card.message && <div>{card.message}</div>}
				{this.renderExtra(card)}
				{card.upgradesFrom !== undefined && (
					<div>from: {Upgrade[card.upgradesFrom]}</div>
				)}
				{card.upgradesTo !== undefined && (
					<div>to: {Upgrade[card.upgradesTo]}</div>
				)}
			</div>
		);
	}

	renderExtra(card: CardType) {
		return (
			<>
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
