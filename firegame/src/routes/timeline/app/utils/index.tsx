import { GameType } from "./NewGame";

// todo dcep93 store<GameType>

function sortBoard(game: GameType) {
	game.board.sort((a, b) => b - a);
}

export { sortBoard };
