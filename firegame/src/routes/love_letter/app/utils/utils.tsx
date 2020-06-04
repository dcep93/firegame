import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";

import { GameType, PlayerType, Ranks, Card } from "./NewGame";

export const store: StoreType<GameType> = store_;

class Utils extends Shared<GameType, PlayerType> {
	advanceTurn() {
		const card = store.gameW.game.deck.pop();
		if (card !== undefined) {
			for (let i = 1; i < store_.gameW.game.players.length; i++) {
				utils.incrementPlayerTurn();
				if (utils.getCurrent().hand) {
					if (
						store.gameW.game.players.filter((p) => p.hand).length >
						1
					) {
						utils.getCurrent().hand!.push(card);
					} else {
						store.gameW.game.played = -1;
					}
					return;
				}
			}
		}
		const orderedPlayers = Array.from(store.gameW.game.players)
			.map((player, index) => ({ index, value: getValue(player) }))
			.sort((a, b) => b.value - a.value);
		store.gameW.game.currentPlayer = orderedPlayers[0]!.index;
		store.gameW.game.played = -1;
	}

	cardString(card: Card): string {
		return `${Card[card]} (${Ranks[card]})`;
	}

	discard(player: PlayerType) {
		if (!player.played) player.played = [];
		player.played.splice(0, 0, ...player.hand!);
		delete player.hand;
	}
}

function getValue(player: PlayerType): number {
	if (!player.hand) return -1;
	return Ranks[player.hand[0]];
}

const utils = new Utils();

export default utils;
