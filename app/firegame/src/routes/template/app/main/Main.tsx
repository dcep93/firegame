import React from "react";
import { store } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";

class Main extends React.Component {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>Main</h2>
				<pre>{JSON.stringify(store.gameW.game)}</pre>
			</div>
		);
	}
}

export default Main;
