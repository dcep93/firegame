import React from "react";

import Actions from "./Actions";
import Settings from "./Settings";
import Players from "./Players";
import Render from "./Render";

class Timeline extends Actions {
	render() {
		return (
			<div>
				<div>
					<Settings />
					<Players
						userId={this.props.userId}
						host={this.props.host}
						lobby={this.props.lobby}
					/>
				</div>
				{this.props.game && <Render />}
			</div>
		);
	}
}

export default Timeline;
