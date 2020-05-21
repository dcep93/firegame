import React from "react";

import utils, { store } from "../../utils";
import bank from "../../utils/bank";
import { CommercialType } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class Anubis extends React.Component<{
	commercial: CommercialType;
	pop: () => void;
}> {
	render() {
		const wondersToUnbuild = utils
			.getMe()
			.wonders.concat(utils.getOpponent().wonders)
			.filter((wonder) => wonder.built);
		if (!wondersToUnbuild) {
			if (!utils.isMyTurn()) return null;
			this.props.pop();
			alert("no wonders to destroy");
			return null;
		}
		return (
			<div className={styles.bubble}>
				<h2>Unbuild Wonder</h2>
				<div className={styles.flex}>
					{wondersToUnbuild.map((wonder) => (
						<div
							onClick={() => {
								if (!utils.isMyTurn()) return;
								wonder.built = false;
								this.props.pop();
								store.update(
									`unbuilt ${
										bank.wonders[wonder.wonderIndex].name
									}`
								);
							}}
						>
							{bank.wonders[wonder.wonderIndex].name}
						</div>
					))}
					)}
				</div>
			</div>
		);
	}
}

export default Anubis;
