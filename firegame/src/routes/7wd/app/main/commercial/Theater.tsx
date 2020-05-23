import React from "react";

import utils, { store } from "../../utils";
import bank from "../../utils/bank";
import { ScienceToken } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class Theater extends React.Component {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Pick a god</h2>
				<div className={styles.flex}>
					{Object.values(store.gameW.game.gods)
						.flatMap((gods) => gods)
						.map((godIndex) => ({
							godIndex,
							god: bank.gods[godIndex],
						}))
						.map((obj) => (
							<div
								onClick={() => {
									if (!utils.isMyTurn()) return;
									const gods =
										store.gameW.game.gods[obj.god.source!];
									const index = gods.indexOf(obj.godIndex);
									const me = utils.getMe();
									if (!me.gods) me.gods = [];
									me.gods.push(gods.splice(index, 1)[0]);
									utils.endCommercial(
										`built ${obj.god.name}`
									);
								}}
								className={styles.bubble}
								title={JSON.stringify(obj.god, null, 2)}
							>
								{obj.god.name}
								{obj.god.name}
								{obj.god.name === "enki" &&
									` - ${store.gameW.game
										.enki!.map((token) =>
											utils.enumName(token, ScienceToken)
										)
										.join(" ")}`}
							</div>
						))}
				</div>
			</div>
		);
	}
}

export default Theater;
