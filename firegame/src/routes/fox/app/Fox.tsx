import React from "react";

import { shared, store } from "./utils/utils";
import Main from "./main/Main";
import Sidebar from "./sidebar/Sidebar";

import styles from "../../../shared/styles.module.css";
import css from "./index.module.css";

class Fox extends React.Component {
	render() {
		const classes = [css.main];
		if (shared.isMyTurn()) classes.push(styles.my_turn);
		return (
			<div>
				<div className={classes.join(" ")}>
					<Sidebar />
					<div className={css.content}>
						<div>{store.gameW.game && <Main />}</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Fox;
