import ActionComponent from "./ActionComponent";
import utils from "../utils/utils";
import { Ranks } from "../utils/NewGame";

class Guard extends ActionComponent {
	render() {
		return null;
	}

	execute() {
		var choice;
		for (let i = 0; i < 10; i++) {
			choice = prompt(`Choose a rank for ${this.props.player.userName}`);
			if (choice !== "1" && choice !== null) break;
		}
		if (this.executed) return;
		this.executed = true;
		this.props.reset();
		const correct = choice === Ranks[this.props.player.hand![0]].toString();
		if (correct) utils.discard(this.props.player, true);
		this.props.finish(
			`guessed ${choice} for [${this.props.player.userName}] - ${
				correct ? "correct" : "incorrect"
			}`
		);
	}
}

export default Guard;
