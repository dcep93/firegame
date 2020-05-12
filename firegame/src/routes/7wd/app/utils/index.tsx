import Shared from "../../../../shared";
import store_, { StoreType } from "../../../../shared/store";

import { GameType, PlayerType } from "./NewGame";
import bank, { CardType } from "./bank";

class Utils extends Shared<GameType, PlayerType> {
	getOpponent(game_: GameType | undefined = undefined) {
		const game = game_ || store.gameW.game!;
		return game.players[1 - this.myIndex(game)];
	}
}

const store: StoreType<GameType> = store_;
const utils = new Utils();

function deal(game: GameType) {
	const indexedCards = bank.cards
		.map((card, index) => ({ card, index }))
		.filter((ic) => ic.card.age === game.age);
	const indices = indexedCards.map((ic) => ic.index);
	utils.shuffle(indices);
	game.structure = bank.structure[game.age]!.map((mapRow, rowIndex) =>
		mapRow.map((offset) => ({
			offset,
			cardIndex: indices.pop()!,
			revealed: rowIndex % 2 === 0,
			taken: false,
		}))
	);
}

function getCost(card: CardType) {
	return 3 + card.cost.length - (utils.getMe().cards || []).length;
}

export { store, utils, deal, getCost };
