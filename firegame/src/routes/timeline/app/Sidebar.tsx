import React from "react";

import css from "./index.module.css";

import Settings from "./Settings";
import Players from "./Players";
import Info from "./Info";
import Log from "./Log";
import { LobbyType } from "../../../firegame/wrapper/C_LobbyListener";
import { GameType } from "./Render";
import { InfoType } from "../../../firegame/wrapper/D_Base";

class Sidebar extends React.Component<{
	sendGameState: (message: string, newState: GameType) => void;
	info: InfoType;
	userId: string;
	lobby: LobbyType;
	game?: GameType;
}> {
	render() {
		return (
			<div className={css.sidebar}>
				<Settings
					userId={this.props.userId}
					sendGameState={this.props.sendGameState}
				/>
				<Players
					userId={this.props.userId}
					host={this.props.info.host}
				/>
				{this.props.game && <Info game={this.props.game} />}
				<Log info={this.props.info} game={this.props.game} />
			</div>
		);
	}
}

export default Sidebar;
