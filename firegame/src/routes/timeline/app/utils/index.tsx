import { GameType } from "./NewGame";

function sortBoard(game: GameType) {
	game.board.sort((a, b) => b - a);
}

export { sortBoard };
