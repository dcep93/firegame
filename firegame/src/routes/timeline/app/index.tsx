import React from "react";

import Render from "./Render";

import css from "./index.module.css";

import Sidebar from "./Sidebar";
import Store from "../../../shared/Store";

class Timeline extends React.Component {
	render() {
		return (
			<div>
				<div className={css.main}>
					<Sidebar />
					<div className={css.content}>
						<div>{Store.getGameW().game && <Render />}</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Timeline;
