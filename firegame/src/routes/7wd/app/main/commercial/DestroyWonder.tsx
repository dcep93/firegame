import React from "react";

import utils, { store } from "../../utils";
import bank from "../../utils/bank";
import { CommercialType } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class DestroyWonder extends React.Component<{
	commercial: CommercialType;
	pop: () => void;
}> {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Destroy Wonder</h2>
				<div className={styles.flex}>
					{utils
						.getMe()
						.wonders.map((wonder, index) => ({
							wonder,
							index,
						}))
						.filter((obj) => !obj.wonder.built)
						.map((obj) => (
							<div
								onClick={() => {
									if (!utils.isMyTurn()) return;
									utils.getMe().wonders.splice(obj.index, 1);
									this.props.pop();
									store.update(
										`destroyed ${
											bank.wonders[obj.wonder.wonderIndex]
												.name
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

export default DestroyWonder;
