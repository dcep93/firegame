import React from "react";

import styles from "../../../../shared/styles.module.css";

class Rules extends React.Component {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Rules</h2>
				<pre className={styles.bubble}>
					<div>
						<span>11</span>{" "}
						<span>
							If lead, force either a 1 of same suit or highest
							card of same suit
						</span>
					</div>
					<div>
						<span>9</span>
						{"  "}
						<span>Counts as trump if is only 9</span>
					</div>
					<div>
						<span>7</span>
						{"  "}
						<span>Winner of this trick gets a point</span>
					</div>
					<div>
						<span>5</span>
						{"  "}
						<span>
							Draw a card, then put a card at bottom of deck
						</span>
					</div>
					<div>
						<span>3</span>
						{"  "}
						<span>May trade trump card with a card in hand</span>
					</div>
					<div>
						<span>1</span>
						{"  "}
						<span>Lead next trick even if lose this trick</span>
					</div>
				</pre>
				<pre className={styles.bubble}>
					<div>
						<span>0-3</span>
						{"  "}/<span>6</span> <span>Humble</span>
					</div>
					<div>
						<span>4</span>
						{"    "}/<span>1</span> <span>DEFEATED</span>
					</div>
					<div>
						<span>5</span>
						{"    "}/<span>2</span> <span>Defeated</span>
					</div>
					<div>
						<span>6</span>
						{"    "}/<span>3</span> <span>defeated</span>
					</div>
					<div>
						<span>7-9</span>
						{"  "}/<span>6</span> <span>Victory</span>
					</div>
					<div>
						<span>10-13</span>/<span>0</span> <span>Greedy</span>
					</div>
				</pre>
			</div>
		);
	}
}

export default Rules;
