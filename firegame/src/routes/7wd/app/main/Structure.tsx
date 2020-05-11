import React from "react";

import { store } from "../utils";

import StructureCard from "./StructureCard";

import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";

class Structure extends React.Component {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Structure</h2>
				{store.gameW.game.structure.map((row, i1) => (
					<div
						key={i1}
						className={`${css.structure_row} ${
							i1 === 0 && css.structure_first_row
						}`}
					>
						{Object.entries(row).map(([offset, card], i2) => (
							<StructureCard
								key={i2}
								y={i1}
								x={i2}
								offset={offset}
								{...card}
							/>
						))}
					</div>
				))}
			</div>
		);
	}
}

export default Structure;
