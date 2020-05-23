import React from "react";

import utils from "../../utils/utils";
import bank from "../../utils/bank";
import { WonderType, PlayerType } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";
import css from "../../index.module.css";

class Wonders extends React.Component<{
	player: PlayerType;
	select: (index: number) => void;
	selected?: number;
}> {
	render() {
		return (
			<div className={`${styles.bubble} ${css.nowrap}`}>
				{this.props.player.wonders.map((_, index) =>
					this.renderWonder(index)
				)}
			</div>
		);
	}

	renderWonder(index: number) {
		const playerWonder = this.props.player.wonders[index];
		const wonder = bank.wonders[playerWonder.wonderIndex];
		const contents = playerWonder.built
			? this.renderBuilt(wonder)
			: this.renderUnbuilt(wonder, index);
		return (
			<div key={index} title={JSON.stringify(wonder, null, 2)}>
				{contents}
			</div>
		);
	}

	renderBuilt(wonder: WonderType) {
		return <div className={css.built_wonder}>{wonder.name}</div>;
	}

	renderUnbuilt(wonder: WonderType, index: number) {
		return (
			<div
				className={
					index === this.props.selected ? styles.grey : undefined
				}
				onClick={(e: React.MouseEvent) => this.selectSelf(index, e)}
			>
				{wonder.name} - {wonder.cost.join("")} ($
				{utils.getWonderCost(wonder, this.props.player)})
			</div>
		);
	}

	selectSelf(index: number, e: React.MouseEvent) {
		e.stopPropagation();
		this.props.select(index);
	}
}

export default Wonders;
