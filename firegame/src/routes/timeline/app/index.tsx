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
					<Sidebar
						sendGameState={this.props.sendGameState}
						info={this.props.info}
						userId={this.props.userId}
						lobby={this.props.lobby}
						game={this.props.game}
					/>
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
			</div>
		);
	}
}

export default Timeline;
