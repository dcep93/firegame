import Game from "../../../shared/components/Game";

import { GameType } from "./Render";

class Actions extends Game<GameType> {
	increment(): void {
		this.props.game.dan++;
		this.props.sendGameState(this.props.game);
	}
}

export default Actions;
