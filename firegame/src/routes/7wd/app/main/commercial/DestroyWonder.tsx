import React from "react";

import utils from "../../utils";
import bank from "../../utils/bank";

import styles from "../../../../../shared/styles.module.css";

class DestroyWonder extends React.Component {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Destroy Wonder</h2>
				<div className={styles.flex}>
					{utils
						.getCurrent()
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
									utils.endCommercial(
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
