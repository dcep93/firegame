import React from "react";

import utils from "../../utils";
import { ScienceToken } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class Sciences extends React.Component<{ sciences: ScienceToken[] }> {
	render() {
		return (
			<div className={styles.bubble}>
				{this.props.sciences.map((science) => (
					<div key={science} title={science}>
						{ScienceToken[utils.enumName(science, ScienceToken)]}
					</div>
				))}
			</div>
		);
	}
}

export default Sciences;