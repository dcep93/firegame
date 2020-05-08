import React from "react";

import css from "./index.module.css";

import Settings from "./Settings";
import Players from "./Players";
import Info from "./Info";
import Log from "./Log";
import Store from "../../../shared/Store";

class Sidebar extends React.Component {
	render() {
		return (
			<div className={css.sidebar}>
				<Settings />
				<Players />
				{Store.getGameW().game !== undefined && <Info />}
				<Log />
			</div>
		);
	}
}

export default Sidebar;
