import React from "react";

import Actions from "./Actions";
import Settings from "./Settings";
import Render from "./Render";

class Timeline extends Actions {
	render() {
		return (
			<div>
				<Settings />
				{this.props.game && <Render />}
			</div>
		);
	}
}

export default Timeline;
