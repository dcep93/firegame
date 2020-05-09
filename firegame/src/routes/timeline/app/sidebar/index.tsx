import React from "react";

import { store } from "../utils";

import Settings from "./Settings";
import Players from "./Players";
import Info from "./Info";
import Log from "./Log";

import css from "../index.module.css";

class Sidebar extends React.Component {
	render() {
		return (
			<div className={css.sidebar}>
				<Log />
				<Settings />
				<Players />
				{store.gameW.game && <Info />}
			</div>
		);
	}
}

export default Sidebar;
