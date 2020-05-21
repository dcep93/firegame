import React from "react";

import utils, { store } from "../../utils";
import bank from "../../utils/bank";

import styles from "../../../../../shared/styles.module.css";

class Gate extends React.Component {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Pick a top god</h2>
				<div className={styles.flex}>
					{Object.values(store.gameW.game.gods)
						.map((gods) => gods[0])
						.filter(Boolean)
						.map((godIndex) => ({
							godIndex,
							god: bank.gods[godIndex],
						}))
						.map((obj) => (
							<div
								onClick={() => {
									if (!utils.isMyTurn()) return;
									const me = utils.getMe();
									if (!me.gods) me.gods = [];
									me.gods.push(
										store.gameW.game.gods[
											obj.god.source!
										]!.shift()!
									);
								}}
								className={styles.bubble}
								title={JSON.stringify(obj.god, null, 2)}
							>
								{obj.god.name}
							</div>
						))}
				</div>
			</div>
		);
	}
}

export default Gate;