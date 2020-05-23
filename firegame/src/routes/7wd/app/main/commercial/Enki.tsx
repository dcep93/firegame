import React from "react";

import utils from "../../utils";
import { ScienceToken } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";
import store from "../../../../../shared/store";

class Enki extends React.Component {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Choose a Science Token</h2>
				<div className={styles.flex}>
					{store.gameW.game.enki!.map((scienceName: ScienceToken) => (
						<div
							key={scienceName}
							onClick={() => {
								utils.buildScienceToken(scienceName);
								delete store.gameW.game.enki;
							}}
							className={styles.bubble}
						>
							{utils.enumName(scienceName, ScienceToken)} -{" "}
							{scienceName}
						</div>
					))}
				</div>
			</div>
		);
	}
}

export default Enki;
