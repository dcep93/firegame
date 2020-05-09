import store from "./store";

export const VERSION: string = "v0.0.9";

interface TurnGame<T extends PlayerType> {
	currentPlayer: number;
	players: T[];
}

interface PlayerType {
	userId: string;
	userName: string;
}

class Shared<T extends TurnGame<U>, U extends PlayerType> {
	isMyTurn(game_: T | undefined = undefined): boolean {
		const game: T = game_ || store.gameW.game!;
		return game.players[game.currentPlayer].userId === store.me.userId;
	}

	incrementPlayerTurn(game_: T | undefined = undefined): void {
		const game: T = game_ || store.gameW.game!;
		game.currentPlayer = this.playerIndexByIndex(
			game.currentPlayer + 1,
			game
		);
	}

	playerIndexByIndex(
		index: number,
		game_: T | undefined = undefined
	): number {
		const game: T = game_ || store.gameW.game!;
		return index % game.players.length;
	}

	playerIndexById(userId: string, game_: T | undefined = undefined): number {
		const game: T = game_ || store.gameW.game!;
		return game.players.map((player) => player.userId).indexOf(userId);
	}

	myIndex(game: T | undefined = undefined): number {
		return this.playerIndexById(store.me.userId, game);
	}

	getMe(game_: T | undefined = undefined): U {
		const game: T = game_ || store.gameW.game!;
		return game.players[this.myIndex(game)];
	}

	getCurrent(game_: T | undefined = undefined): U {
		const game: T = game_ || store.gameW.game!;
		return game.players[game.currentPlayer];
	}

	shuffle(arr: any[]): void {
		for (let i = arr.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
	}
}

export default Shared;
