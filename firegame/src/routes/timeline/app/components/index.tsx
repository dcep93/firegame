import React from "react";

import Game from "../../../../shared/components/Game";

import Settings from "./Settings";
import Players from "./Players";
import Render from "./Render";

import css from "../css/index.module.css";

import { GameType } from "./Render";

class Timeline extends Game<GameType> {
	render() {
		return (
			<div className={css.main}>
				<div className={css.sidebar}>
					<Settings
						lobby={this.props.lobby}
						sendGameState={this.props.sendGameState}
					/>
					<Players
						userId={this.props.userId}
						host={this.props.host}
						lobby={this.props.lobby}
					/>
				</div>
				<div className={css.content}>
					{this.props.game && (
						<Render
							sendGameState={this.props.sendGameState}
							id={this.props.id}
							game={this.props.game}
						/>
					)}
				</div>
			</div>
		);
	}
}

export default Timeline;
