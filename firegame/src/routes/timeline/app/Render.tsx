import React from "react";

export type GameType = { dan: number };

class Render extends React.Component<any> {
	render() {
		return (
			<div>
				<p>{this.props.game.dan}</p>
				<p>{`timeline ${JSON.stringify(this.props.game)} ${
					this.props.id
				}`}</p>
			</div>
		);
	}
}

export default Render;
