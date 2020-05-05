import React from "react";

import Game from "../../../shared/Game";

class App extends Game {
	inputRef: HTMLInputElement | null = null;
	render() {
		return (
			<div>
				<p>
					{`timeline function ${this.props.roomId} ${this.state.username}`}
				</p>
				<form onSubmit={this.setUsername.bind(this)}>
					<input
						type="text"
						ref={(input) => (this.inputRef = input)}
					/>
				</form>
			</div>
		);
	}

	setUsername(e) {
		e.preventDefault();
		this.setState({ username: this.inputRef!.value });
	}
}

export default App;
