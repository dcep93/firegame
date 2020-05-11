import React from "react";

import Structure from "./Structure";
import Player from "./Player";
import Board from "./Board";

class Main extends React.Component {
	render() {
		return (
			<div>
				<Structure />
				<div>
					<Player index={0} />
					<Player index={1} />
				</div>
				<Board />
			</div>
		);
	}
}

export default Main;
