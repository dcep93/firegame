import Shared from "../../../../shared";
import store, { StoreType } from "../../../../shared/store";

import { GameType, PlayerType } from "./NewGame";
import bank from "./bank";

const store_: StoreType<GameType> = store;
const shared: Shared<GameType, PlayerType> = new Shared();

function deal(game: GameType) {
	const indices = Array.from(Array(bank.bank[game.age]!.length).keys());
	shared.shuffle(indices);
	game.structure = bank.map[game.age]!.map((mapRow, rowIndex) =>
		mapRow.map((offset) => ({
			offset,
			cardIndex: indices.pop()!,
			revealed: rowIndex % 2 === 0,
			taken: false,
		}))
	);
}

export { store_ as store, shared, deal };
