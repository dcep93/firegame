import React from "react";

import Actions from "./Actions";

class Timeline extends Actions {
	render() {
		if (!this.props.game) return null;
		return (
			<div>
				<p>{`timeline ${JSON.stringify(this.props.game)} ${
					this.props.id
				}`}</p>
				<button onClick={this.increment.bind(this)}>abc</button>
			</div>
		);
	}
}

export default Timeline;
