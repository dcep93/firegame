import React from "react";

import { store } from "../utils/utils";

import Settings from "./Settings";
import Players from "./Players";
import Info from "./Info";
import Log from "../../../../shared/components/sidebar/SharedLog";

import styles from "../../../../shared/styles.module.css";

class Sidebar extends React.Component {
	render() {
		return (
			<div className={styles.sidebar}>
				<Settings />
				<Players />
				{store.gameW.game && <Info />}
				<Log />
			</div>
		);
	}
}

export default Sidebar;
