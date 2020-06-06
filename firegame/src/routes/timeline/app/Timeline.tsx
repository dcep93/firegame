import React from "react";

import { shared, store } from "./utils/utils";
import Main from "./main/Main";
import Sidebar from "./sidebar/Sidebar";

import styles from "../../../shared/styles.module.css";

class Timeline extends React.Component {
	render() {
		// todo css help
		// sidebar and main should scroll on separate tracks
		return (
			<div>
				<div
					className={`${styles.main} ${
						shared.isMyTurn() && styles.my_turn
					}`}
				>
					<Sidebar />
					<div className={styles.content}>
						<div>{store.gameW.game && <Main />}</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Timeline;
