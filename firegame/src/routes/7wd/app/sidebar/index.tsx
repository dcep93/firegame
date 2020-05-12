import React from "react";

import Players from "./Players";
import Log from "./Log";

import css from "../index.module.css";

class Sidebar extends React.Component {
	render() {
		return (
			<div className={css.sidebar}>
				<Log />
				<Players />
			</div>
		);
	}
}

export default Sidebar;
