import React from "react";

import utils, { store } from "../../utils";
import bank from "../../utils/bank";

import styles from "../../../../../shared/styles.module.css";

class Theater extends React.Component {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Pick a god</h2>
				<div className={styles.flex}>
					{Object.values(store.gameW.game.gods)
						.flatMap((gods) => gods)
						.map((godIndex) => (
							<div
								onClick={() => {
									if (!utils.isMyTurn()) return;
									const god = bank.gods[godIndex];
									const gods =
										store.gameW.game.gods[god.source!];
									const index = gods.indexOf(godIndex);
									const me = utils.getMe();
									if (!me.gods) me.gods = [];
									me.gods.push(gods.splice(index, 1)[0]);
									utils.endCommercial(`built ${god.name}`);
								}}
								className={styles.bubble}
								title={JSON.stringify(
									bank.gods[godIndex],
									null,
									2
								)}
							>
								{bank.gods[godIndex].name}
							</div>
						))}
				</div>
			</div>
		);
	}
}

export default Theater;
