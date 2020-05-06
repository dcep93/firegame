import React from "react";

type GameType = any;

class Timeline extends React.Component<{
	sendGameState: (newState: GameType) => void;
	game: GameType;
}> {
	render() {
		console.log("render", this.props.game.id);
		return (
			<div>
				<p>{`timeline ${JSON.stringify(this.props)}`}</p>
				<button onClick={this.increment.bind(this)}>Button</button>
			</div>
		);
	}

	increment() {
		const newState = Object.assign({}, this.props.game);
		newState.thetimeitisrightnow++;
		this.props.sendGameState(newState);
	}
}

export default Timeline;
