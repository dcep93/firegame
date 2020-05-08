import React from "react";

import GameElement from "../../../shared/GameElement";

import Render from "./Render";

import css from "./index.module.css";

import { GameType } from "./Render";
import Sidebar from "./Sidebar";

class Timeline extends GameElement<GameType> {
	render() {
		return (
			<div>
				<div className={css.main}>
					<Sidebar />
					<div className={css.content}>
						<div>{this.props.game && <Render />}</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Timeline;
