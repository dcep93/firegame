import React from "react";

import utils from "../../utils";
import { ScienceToken } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class Library extends React.Component<{
	sciences: ScienceToken[];
	buildScience: (science: ScienceToken) => void;
}> {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Library</h2>
				<div className={styles.flex}>
					{this.props.sciences.map((scienceName: ScienceToken) => (
						<div
							onClick={() => this.props.buildScience(scienceName)}
							className={styles.bubble}
							key={scienceName}
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

export default Library;
