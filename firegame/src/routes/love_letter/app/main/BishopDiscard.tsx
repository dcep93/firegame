import { ActionComponent } from "./Action";
import utils, { store } from "../utils/utils";

class BishopDiscard extends ActionComponent {
	render() {
		return null;
	}

	execute() {
		const toDiscard = window.confirm(
			"You were correctly guessed by the bishop. Would you like to discard your hand?"
		);
		if (this.executed) return;
		this.executed = true;
		this.props.reset();
		const cardB = utils.getMe().hand![0];
		if (toDiscard) utils.discard(utils.getMe(), false);
		store.gameW.game.currentPlayer = store.gameW.game.bishop!;
		delete store.gameW.game.bishop;
		this.props.finish(
			toDiscard
				? `discarded ${utils.cardString(cardB)}`
				: "did not discard"
		);
	}
}

export default BishopDiscard;
