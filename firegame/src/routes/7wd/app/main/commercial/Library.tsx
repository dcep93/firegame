import React from "react";

import utils from "../../utils";
import { CommercialType, ScienceToken } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class Library extends React.Component<{
	commercial: CommercialType;
	pop: () => void;
	buildScience: (science: ScienceToken) => void;
}> {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Library</h2>
				<div className={styles.flex}>
					{this.props.commercial.extra.map(
						(scienceName: ScienceToken) => (
							<div
								onClick={() =>
									this.props.buildScience(scienceName)
								}
								className={styles.bubble}
							>
								{
									ScienceToken[
										utils.enumName(
											scienceName,
											ScienceToken
										)
									]
								}{" "}
								- {scienceName}
							</div>
						)
					)}
				</div>
			</div>
		);
	}
}

export default Library;
