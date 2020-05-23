import React from "react";

import utils from "../../utils/utils";
import { ScienceToken } from "../../utils/types";

import styles from "../../../../../shared/styles.module.css";

class Sciences extends React.Component<{ sciences: ScienceToken[] }> {
	render() {
		return (
			<div className={styles.bubble}>
				{this.props.sciences.map((science) => (
					<div key={science} title={science}>
						{utils.enumName(science, ScienceToken)}
					</div>
				))}
			</div>
		);
	}
}

export default Sciences;
