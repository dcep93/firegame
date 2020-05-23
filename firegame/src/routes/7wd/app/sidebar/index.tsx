import React from "react";

import Players from "./Players";
import Log from "./Log";

import styles from "../../../../shared/styles.module.css";

class Sidebar extends React.Component {
	render() {
		return (
			<div className={styles.sidebar}>
				<Log />
				<Players />
			</div>
		);
	}
}

export default Sidebar;
