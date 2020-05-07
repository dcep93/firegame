import Game from "../../../shared/components/Game";

import Builder, { GameType } from "./Builder";

class Actions extends Game<GameType> {
	buildNewGame = Builder;

	increment(): void {
		this.props.game.dan++;
		this.props.sendGameState(this.props.game);
	}
}

export default Actions;
