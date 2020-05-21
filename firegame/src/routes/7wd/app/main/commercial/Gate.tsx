import React from "react";

import utils, { store } from "../../utils";
import bank from "../../utils/bank";
import { CommercialType } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class Gate extends React.Component<{
	commercial: CommercialType;
	pop: () => void;
}> {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Pick a top god</h2>
				<div className={styles.flex}>
					{Object.values(store.gameW.game.gods)
						.map((gods) => gods[0])
						.map((godIndex) => (
							<div
								onClick={() => {
									const god = bank.gods[godIndex];
									const gods =
										store.gameW.game.gods[god.source!];
									const index = gods.indexOf(godIndex);
									const me = utils.getMe();
									if (!me.gods) me.gods = [];
									me.gods.push(gods.splice(index, 1)[0]);
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

export default Gate;
