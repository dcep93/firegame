import store from "./store";

export const VERSION: string = "v0.0.9";

interface TurnGame {
	currentPlayer: number;
	players: PlayerType[];
}

interface PlayerType {
	userId: string;
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
	game.currentPlayer = playerByIndex(game, game.currentPlayer + 1);
}

function playerByIndex(game: TurnGame, index: number): number {
	return index % game.players.length;
}

function myIndex(game: TurnGame): number {
	return game.players.map((player) => player.userId).indexOf(store.me.userId);
}

function getMe(game: TurnGame): PlayerType {
	return game.players[myIndex(game)];
}

export default {
	shuffle,
	isMyTurn,
	playerByIndex,
	incrementPlayerTurn,
	myIndex,
	getMe,
};
