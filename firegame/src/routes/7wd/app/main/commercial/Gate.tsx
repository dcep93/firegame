import React from "react";

import utils, { store } from "../../utils";
import bank from "../../utils/bank";
import { God, ScienceToken } from "../../utils/types";

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
								key={obj.godIndex}
								onClick={() => {
									if (!utils.isMyTurn()) return;
									const me = utils.getMe();
									if (!me.gods) me.gods = [];
									const godIndex = store.gameW.game.gods[
										obj.god.source!
									]!.shift()!;
									me.gods.push(godIndex);
									const god = bank.gods[godIndex];

									const m =
										store.gameW.game.gods[God.mesopotamian];
									if (
										m &&
										god.source !== God.mesopotamian &&
										bank.gods[m[0]].name === "enki"
									)
										delete store.gameW.game.enki;
									god.f();
									utils.endCommercial(`built ${god.name}`);
								}}
								className={styles.bubble}
								title={JSON.stringify(obj.god, null, 2)}
							>
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

export default Gate;
