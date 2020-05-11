import React from "react";

import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";

class StructureCard extends React.Component<{
	cardIndex: number;
	offset: number;
	revealed: boolean;
	taken: boolean;
	x: number;
	y: number;
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
		const p = this.props.offset * 50;
		return `translate(${p}%, 0%)`;
	}

	select() {
		alert(JSON.stringify(this.props));
	}
}

export default StructureCard;
