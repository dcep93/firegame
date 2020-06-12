import utils, { store } from "../utils/utils";
import { deal } from "../utils/NewGame";
import { ActionComponent } from "./Action";

class Winner extends ActionComponent {
	render() {
		return null;
	}

	execute() {
		delete store.gameW.game.played;
		const rawMsg = prompt("What do you do on your date?");
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
