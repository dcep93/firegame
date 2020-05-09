import store from "./store";

export const VERSION: string = "v0.0.9";

interface TurnGame<T extends PlayerType> {
	currentPlayer: number;
	players: T[];
}

interface PlayerType {
	userId: string;
}

class Shared<T extends TurnGame<U>, U extends PlayerType> {
	isMyTurn(game: T): boolean {
		return (
			game && game.players[game.currentPlayer].userId === store.me.userId
		);
	}

	incrementPlayerTurn(game: T): void {
		game.currentPlayer = this.playerByIndex(game, game.currentPlayer + 1);
	}

	playerByIndex(game: T, index: number): number {
		return index % game.players.length;
	}

	myIndex(game: T): number {
		return game.players
			.map((player) => player.userId)
			.indexOf(store.me.userId);
	}

	getMe(game: T): U {
		return game.players[this.myIndex(game)];
	}

	shuffle(arr: any[]): void {
		for (let i = arr.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
	}
}

export default Shared;
