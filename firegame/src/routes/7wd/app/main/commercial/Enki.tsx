import React from "react";

import utils from "../../utils";
import { ScienceToken } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class Enki extends React.Component<{
	extra: any;
	buildScience: (science: ScienceToken) => void;
}> {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Choose a Science Token</h2>
				<div className={styles.flex}>
					{this.props.extra.map((scienceName: ScienceToken) => (
						<div
							onClick={() => this.props.buildScience(scienceName)}
							className={styles.bubble}
						>
							{
								ScienceToken[
									utils.enumName(scienceName, ScienceToken)
								]
							}{" "}
							- {scienceName}
						</div>
					))}
				</div>
			</div>
		);
	}
}

export default Enki;
