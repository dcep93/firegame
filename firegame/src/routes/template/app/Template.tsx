import React from "react";

import utils, { store } from "./utils/utils";
import Main from "./main/Main";
import Sidebar from "./sidebar/Sidebar";

import styles from "../../../shared/styles.module.css";

// this folder should be as small as possible
// common functions should be extended from shared folder!

class Template extends React.Component {
	render() {
		return (
			<div>
				<div
					className={`${styles.main} ${
						utils.isMyTurn() && styles.my_turn
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

export default Template;
