import React from "react";

import styles from "../../../../shared/styles.module.css";
import { Difficulty, CardW } from "../utils/NewGame";

class Card extends React.Component<{ cardW?: CardW }> {
	render() {
		if (this.props.cardW === undefined) return null;
		return (
			<div>
				<div className={styles.bubble}>
					<div>Level: {Difficulty[this.props.cardW.difficulty]}</div>
					<div>
						{this.props.cardW.card.a} -> {this.props.cardW.card.b}
					</div>
				</div>
			</div>
		);
	}
}

export default Card;
