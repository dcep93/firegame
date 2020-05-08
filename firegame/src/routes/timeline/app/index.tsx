import React from "react";

import GameElement from "../../../shared/GameElement";

import Settings from "./Settings";
import Players from "./Players";
import Render from "./Render";

import css from "./index.module.css";

import { GameType } from "./Render";
import Info from "./Info";

class Timeline extends GameElement<GameType> {
	render() {
		return (
			<div className={css.main}>
				<div className={css.sidebar}>
					<Settings
						userId={this.props.userId}
						lobby={this.props.lobby}
						sendGameState={this.props.sendGameState}
					/>
					<Players
						userId={this.props.userId}
						host={this.props.host}
						lobby={this.props.lobby}
					/>
					{this.props.game && <Info game={this.props.game} />}
				</div>
				<div className={css.content}>
					<div>
						{this.props.game && (
							<Render
								sendGameState={this.props.sendGameState}
								game={this.props.game}
								myIndex={
									this.props.game.players
										.filter(
											(player) =>
												player.userId ===
												this.props.userId
										)
										.map((player) => player.index)[0]
								}
							/>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default Timeline;
