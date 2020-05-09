import React from "react";

import css from "./index.module.css";

import Settings from "./Settings";
import Players from "./Players";
import Info from "./Info";
import Log from "./Log";
import Store from "../../../shared/store";

class Sidebar extends React.Component {
	render() {
		return (
			<div className={css.sidebar}>
				<Log />
				<Settings />
				<Players />
				{Store.gameW.game !== undefined && <Info />}
			</div>
		);
	}
}

export default Sidebar;
