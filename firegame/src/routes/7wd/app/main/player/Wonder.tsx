import React from "react";

import utils from "../../utils";
import bank from "../../utils/bank";
import { PlayerType, WonderType } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";
import css from "../../index.module.css";

class Wonder extends React.Component<{
	index: number;
	select: (index: number) => void;
	selected?: number;
	player: PlayerType;
}> {
	render() {
		const wonder =
			bank.wonders[
				this.props.player.wonders[this.props.index].wonderIndex
			];
		return this.props.player.wonders[this.props.index].built
			? this.renderBuilt(wonder)
			: this.renderUnbuilt(wonder);
	}

	renderBuilt(wonder: WonderType) {
		return <div className={css.built_wonder}>{wonder.name}</div>;
	}

	renderUnbuilt(wonder: WonderType) {
		return (
			<div
				className={
					this.props.index === this.props.selected
						? styles.grey
						: undefined
				}
				onClick={this.selectSelf.bind(this)}
			>
				{wonder.name} - {wonder.cost} (${utils.getWonderCost(wonder)})
			</div>
		);
	}

	selectSelf(e: React.MouseEvent) {
		e.stopPropagation();
		this.props.select(this.props.index);
	}
}

export default Wonder;
