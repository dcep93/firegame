import React from "react";

import utils, { store } from "../../utils";
import bank from "../../utils/bank";
import { CommercialType } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class Ra extends React.Component<{
	commercial: CommercialType;
	pop: () => void;
}> {
	render() {
		const wondersToSteal = utils
			.getOpponent()
			.wonders.map((wonder, index) => ({ wonder, index }))
			.filter((obj) => !obj.wonder.built);
		if (!wondersToSteal) {
			if (!utils.isMyTurn()) return;
			this.props.pop();
			alert("no wonders to steal");
			return;
		}
		return (
			<div className={styles.bubble}>
				<h2>Steal Wonder</h2>
				<div className={styles.flex}>
					{wondersToSteal.map((obj) => (
						<div
							onClick={() => {
								if (!utils.isMyTurn()) return;
								const wonder = utils
									.getOpponent()
									.wonders.splice(obj.index, 1)[0];
								utils.getMe().wonders.push(wonder);
								this.props.pop();
								store.update(
									`stole ${
										bank.wonders[wonder.wonderIndex].name
									}`
								);
							}}
						>
							{bank.wonders[obj.wonder.wonderIndex].name}
						</div>
					))}
					)}
				</div>
			</div>
		);
	}
}

export default Ra;
