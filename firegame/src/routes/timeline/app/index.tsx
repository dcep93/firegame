import Game from "../../../shared/Game";

class App extends Game {
	render() {
		return `timeline function ${this.props.roomId} ${this.state.username}`;
	}
}

export default App;
