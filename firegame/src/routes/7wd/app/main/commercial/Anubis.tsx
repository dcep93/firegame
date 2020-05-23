import React from "react";

import utils from "../../utils";
import bank from "../../utils/bank";

import styles from "../../../../../shared/styles.module.css";

class Anubis extends React.Component {
	render() {
		const wondersToUnbuild = utils
			.getMe()
			.wonders.concat(utils.getOpponent().wonders)
			.filter((wonder) => wonder.built);
		if (!wondersToUnbuild.length) {
			utils.endCommercial("couldnt destroy a wonder");
			return;
		}
		return (
			<div className={styles.bubble}>
				<h2>Unbuild Wonder</h2>
				<div className={styles.flex}>
					{wondersToUnbuild
						.map((wonderObj) => ({
							wonderObj,
							wonder: bank.wonders[wonderObj.wonderIndex],
						}))
						.map((obj) => (
							<div
								key={obj.wonderObj.wonderIndex}
								className={styles.bubble}
								onClick={() => {
									if (!utils.isMyTurn()) return;
									obj.wonderObj.built = false;
									utils.endCommercial(
										`unbuilt ${obj.wonder.name}`
									);
								}}
							>
								{obj.wonder.name}
							</div>
						))}
				</div>
			</div>
		);
	}
}

export default Anubis;
