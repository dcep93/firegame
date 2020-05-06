import Firebase from "./Firebase";

import Lobby from "./Lobby";

abstract class Game extends Lobby {
	constructor(props) {
		super(props);
		this.setSessionId();
		this.state = { sessionId: sessionStorage.sessionId };
	}

	componentDidMount() {
		Firebase.init();
		this.initLobby();
	}

	setSessionId() {
		if (!sessionStorage.sessionId)
			sessionStorage.sessionId = btoa(Math.random().toString());
	}
}

export default Game;
