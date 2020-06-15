import React from "react";

import styles from "../../../../shared/styles.module.css";
import utils from "../utils/utils";

class Hand extends React.Component<{
	buyHandCard: (index: number) => void;
}> {
	render() {
		const me = utils.getMe();
		if (!me) return null;
		return (
			<div className={styles.bubble}>
				<h2>Hand</h2>
				{(me.hand || []).map((c, index) => (
					<div
						key={index}
						onClick={() => this.props.buyHandCard(index)}
					>
						{utils.cardString(c)}
					</div>
				))}
			</div>
		);
	}
}

export default Hand;
