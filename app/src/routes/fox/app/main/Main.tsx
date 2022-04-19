import React from "react";

import Hand from "./Hand";
import Field from "./Field";
import Rules from "./Rules";

class Main extends React.Component<{}, { selectedIndex: number }> {
	render() {
		return (
			<div>
				<Hand />
				<br />
				<Field />
				<br />
				<Rules />
			</div>
		);
	}
}

export default Main;
