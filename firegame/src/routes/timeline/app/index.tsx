import React from "react";

import store from "../../../shared/store";

import Main from "./main";
import Sidebar from "./sidebar";

import css from "./index.module.css";

class Timeline extends React.Component {
	render() {
		// todo css help
		return (
			<div>
				<div className={css.main}>
					<Sidebar />
					<div className={css.content}>
						<div>{store.gameW.game && <Main />}</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Timeline;
