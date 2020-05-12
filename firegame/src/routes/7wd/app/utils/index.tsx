import Shared from "../../../../shared";
import store, { StoreType } from "../../../../shared/store";

import { GameType, PlayerType } from "./NewGame";
import bank, { CardType } from "./bank";

const store_: StoreType<GameType> = store;
const shared: Shared<GameType, PlayerType> = new Shared();

function deal(game: GameType) {
	const indexedCards = bank.cards
		.map((card, index) => ({ card, index }))
		.filter((ic) => ic.card.age === game.age);
	const indices = indexedCards.map((ic) => ic.index);
	shared.shuffle(indices);
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
	return 3 + card.cost.length - (shared.getMe().cards || []).length;
}

export { store_ as store, shared, deal, getCost };
