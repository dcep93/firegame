import React from "react";

import { shared, store } from "./utils/utils";
import Main from "./main/Main";
import Sidebar from "./sidebar/Sidebar";

import styles from "../../../shared/styles.module.css";

class Fox extends React.Component {
	render() {
		return (
			<div className={`${shared.isMyTurn() && styles.my_turn}`}>
				<div className={styles.main}>
					<Sidebar />
					<div className={styles.content}>
						<div>{store.gameW.game && <Main />}</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Fox;
