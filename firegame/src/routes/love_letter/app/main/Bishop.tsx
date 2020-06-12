import { Ranks } from "../utils/NewGame";
import utils, { store } from "../utils/utils";
import { ActionComponent } from "./Action";

class Bishop extends ActionComponent {
	render() {
		return null;
	}

	execute() {
		var choiceB;
		for (let i = 0; i < 10; i++) {
			choiceB = prompt(`Choose a rank for ${this.props.player.userName}`);
			if (choiceB !== null) break;
		}
		this.props.reset();
		const correct =
			choiceB === Ranks[this.props.player.hand![0]].toString();
		const msgB = `guessed ${choiceB} for [${
			this.props.player.userName
		}] - ${correct ? "correct" : "incorrect"}`;
		if (correct) {
			utils.getMe().score++;
			store.gameW.game.bishop = utils.myIndex();
			store.gameW.game.currentPlayer = this.props.index;
			store.update(msgB);
		} else {
			this.props.finish(msgB);
		}
	}
}

export default Bishop;
