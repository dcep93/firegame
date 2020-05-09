import store from "./store";

export const VERSION: string = "v0.0.9";

interface TurnGame {
	currentPlayer: number;
	players: { userId: string }[];
}

function shuffle(arr: any[]) {
	for (let i = arr.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
}

function isMyTurn(game: TurnGame) {
	return game && game.players[game.currentPlayer].userId === store.me.userId;
}

function incrementPlayerTurn(game: TurnGame): void {
	game.currentPlayer = (game.currentPlayer + 1) % game.players.length;
}

export default { shuffle, isMyTurn, incrementPlayerTurn };
