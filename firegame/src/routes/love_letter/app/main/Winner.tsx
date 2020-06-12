import utils, { store } from "../utils/utils";
import { deal } from "../utils/NewGame";
import ActionComponent from "./ActionComponent";

class Winner extends ActionComponent {
	render() {
		return null;
	}

	execute() {
		const rawMsg = prompt("What do you do on your date?");
		if (this.executed) return;
		this.executed = true;
		this.props.reset();
		delete store.gameW.game.played;
		const ranks = store.gameW.game.players
			.filter((p) => p.hand)
			.map((p) => `${p.userName}: ${utils.cardString(p.hand![0])}`)
			.join(", ");
		const msg = `{${ranks}} ${rawMsg || "has a boring date"}`;
		deal(store.gameW.game);
		store.gameW.info.alert = msg;
		utils.getMe().score++;
		store.update(msg);
	}
}

export default Winner;
