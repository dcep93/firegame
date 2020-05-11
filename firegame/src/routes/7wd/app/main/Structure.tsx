import React from "react";

import { store } from "../utils";
import { StructureRow } from "../utils/NewGame";

import StructureCard from "./StructureCard";

import styles from "../../../../shared/styles.module.css";

class Structure extends React.Component {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Structure</h2>
				{store.gameW.game.structure.flatMap(this.renderRow.bind(this))}
			</div>
		);
	}

	renderRow(row: StructureRow, index: number) {
		return Object.entries(row).map(([position, card]) => (
			<StructureCard
				key={card.cardIndex}
				rowIndex={index}
				position={parseInt(position)}
				{...card}
			/>
		));
	}
}

export default Structure;
