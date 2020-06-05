import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";

import { GameType, PlayerType, Ranks, Card } from "./NewGame";

export const store: StoreType<GameType> = store_;

export const WINNER = -1;

class Utils extends Shared<GameType, PlayerType> {
	advanceTurn() {
		const card = (store.gameW.game.deck || []).pop();
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
						store.gameW.game.played = WINNER;
					}
					return;
				}
			}
		}
		// todo ties
		const orderedPlayers = Array.from(store.gameW.game.players)
			.map((player, index) => ({ index, value: getValue(player) }))
			.sort((a, b) => b.value - a.value);
		store.gameW.game.currentPlayer = orderedPlayers[0]!.index;
		store.gameW.game.played = -1;
	}

	cardString(card: Card): string {
		return `${Card[card]} (${Ranks[card]})`;
	}

	discard(player: PlayerType, knockedOut: boolean) {
		const card = player.hand![0];
		if (!player.played) player.played = [];
		if (knockedOut || card === Card.princess) {
			delete player.hand;
			player.score += player.played.filter(
				(c) => c === Card.constable
			).length;
		} else {
			const draw = store.gameW.game.deck
				? store.gameW.game.deck.pop()!
				: store.gameW.game.aside;
			player.hand = [draw];
		}
		player.played.push(card);
	}
}

function getValue(player: PlayerType): number {
	if (!player.hand) return -1;
	return (
		Ranks[player.hand[0]] +
		(player.played || []).filter((c) => c === Card.count).length
	);
}

const utils = new Utils();

export default utils;
