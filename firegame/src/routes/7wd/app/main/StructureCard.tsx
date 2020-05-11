import React from "react";

import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";

class StructureCard extends React.Component<{
	rowIndex: number;
	position: number;
	cardIndex: number;
	revealed: boolean;
}> {
	render() {
		return (
			<div
				className={`${css.structure_card} ${styles.bubble}`}
				onClick={this.select.bind(this)}
				style={{ transform: this.getTransform() }}
			>
				{JSON.stringify(this.props)}
			</div>
		);
	}

	getTransform() {
		return "translate(-20%, -80%)";
	}

	select() {
		alert(JSON.stringify(this.props));
	}
}

export default StructureCard;
