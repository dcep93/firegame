import React from "react";

import { shared, store } from "./utils";
import Main from "./main";
import Sidebar from "./sidebar";

import styles from "../../../shared/styles.module.css";
import css from "./index.module.css";

// this folder should be as small as possible
// common functions should be extended from shared folder!

class Template extends React.Component {
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

export default Template;