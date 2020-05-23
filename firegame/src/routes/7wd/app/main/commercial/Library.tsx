import React from "react";

import utils, { store } from "../../utils/utils";
import { ScienceToken } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class Library extends React.Component<{}> {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Library</h2>
				<div className={styles.flex}>
					{store.gameW.game.commercials![0].library!.map(
						(scienceName: ScienceToken) => (
							<div
								onClick={() =>
									utils.buildScienceToken(scienceName)
								}
								className={styles.bubble}
								key={scienceName}
							>
								{utils.enumName(scienceName, ScienceToken)} -{" "}
								{scienceName}
							</div>
						)
					)}
				</div>
			</div>
		);
	}
}

export default Library;
