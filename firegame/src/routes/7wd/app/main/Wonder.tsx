import React from "react";
import bank from "../utils/bank";

import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";
import utils from "../utils";
import { PlayerType } from "../utils/types";

class Wonder extends React.Component<{
	index: number;
	select?: (index: number) => void;
	selected?: number;
	player: PlayerType;
}> {
	render() {
		return this.props.player.wonders[this.props.index].built
			? this.renderBuilt()
			: this.renderUnbuilt();
	}

	renderBuilt() {
		return (
			<div className={css.built_wonder}>
				{
					bank.wonders[
						this.props.player.wonders[this.props.index].wonderIndex
					].name
				}
			</div>
		);
	}

	renderUnbuilt() {
		const wonder =
			bank.wonders[
				this.props.player.wonders[this.props.index].wonderIndex
			];
		return (
			<div
				className={
					this.props.index === this.props.selected
						? styles.grey
						: undefined
				}
				onClick={
					this.props.select ? this.selectSelf.bind(this) : undefined
				}
			>
				{wonder.name} - {wonder.cost} (${utils.getWonderCost(wonder)})
			</div>
		);
	}

	selectSelf(e: React.MouseEvent) {
		e.stopPropagation();
		this.props.select!(this.props.index);
	}
}

export default Wonder;
