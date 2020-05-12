import Shared from "../../../../shared";
import store_, { StoreType } from "../../../../shared/store";

import { GameType, PlayerType } from "./NewGame";
import bank, { CardType, Resource, ScienceToken, Color } from "./bank";

const BASE_COST = 2;

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

function getCost(card: CardType): number {
	const cards = utils.getMe().cards || [];
	if (
		cards.filter(
			(cardIndex) =>
				card.upgradesFrom &&
				bank.cards[cardIndex].upgradesTo === card.upgradesFrom
		).length !== 0
	)
		return 0;
	if (
		(utils.getMe().sciences || []).includes(ScienceToken.masonry) &&
		card.color === Color.blue
	)
		return 0;
	const costs = countResources(card.cost);
	const myResources = countResources(
		cards.flatMap((cardIndex) => bank.cards[cardIndex].extra.resource || [])
	);
	const oppResources = countResources(
		(utils.getOpponent().cards || []).flatMap(
			(cardIndex) => bank.cards[cardIndex].extra.resource || []
		)
	);
	const discounts = cards.flatMap(
		(cardIndex) => bank.cards[cardIndex].extra.discount || []
	);

	var price = costs[Resource.money] || 0;
	delete costs[Resource.money];

	const paid: { [r in Resource]?: { pricePer: number; needed: number } } = {};
	Object.keys(costs).forEach((r: string) => {
		// @ts-ignore
		const resource: Resource = r;
		const needed = costs[resource]! - (myResources[resource] || 0);
		if (needed <= 0) return;
		const pricePer = discounts.includes(resource)
			? 1
			: BASE_COST + (oppResources[resource] || 0);
		paid[resource] = { pricePer, needed };
		price += needed * pricePer;
	});

	cards
		.map((cardIndex) => bank.cards[cardIndex].extra.resourceOptions)
		.filter(Boolean)
		.forEach((options) => {
			var pricePer = 0;
			var resource: Resource | null = null;
			Object.entries(paid).forEach(([r_, o]) => {
				// @ts-ignore
				const r: Resource = r_;
				if (o!.needed < 0 || !options?.includes(r)) return;
				if (o!.pricePer > pricePer) {
					pricePer = o!.pricePer;
					resource = r;
				}
			});
			if (resource === null) return;
			const picked: any = paid[resource];
			picked.needed--;
			price -= pricePer;
		});
	if (
		(utils.getMe().sciences || []).includes(ScienceToken.engineering) &&
		price > 0
	)
		return 1;
	return price;
}

function countResources(pool: Resource[]): { [r in Resource]?: number } {
	const resources: { [r in Resource]?: number } = {};
	pool.forEach((resource) => {
		resources[resource] = (resources[resource] || 0) + 1;
	});
	return resources;
}

function getScore(player: PlayerType): number {
	const cardPoints = (player.cards || [])
		.map((cardIndex) => bank.cards[cardIndex].extra.points || 0)
		.reduce((a, b) => a + b, 0);
	const moneyPoints = Math.floor(player.money / 3);
	const guildPoints = (player.cards || [])
		.map((cardIndex) => bank.cards[cardIndex].extra.guild)
		.filter(Boolean)
		.map((g) => Math.max(g!(utils.getMe()), g!(utils.getOpponent())))
		.reduce((a, b) => a + b, 0);
	const militaryDiff =
		player.military - store.gameW.game.players[1 - player.index].military;
	const militaryPoints = getMilitaryPoints(militaryDiff);
	const sciencePoints = (player.sciences || [])
		.map((token) => tokenToPoints[token])
		.filter(Boolean)
		.map((f) => f!(player))
		.reduce((a: number, b: number) => a + b, 0)!;
	return (
		cardPoints + moneyPoints + guildPoints + militaryPoints + sciencePoints
	);
}

const tokenToPoints: {
	[token in ScienceToken]?: (player: PlayerType) => number;
} = {
	[ScienceToken.agriculture]: () => 4,
	[ScienceToken.mathematics]: (player: PlayerType) => player.sciences.length,
	// todo
	[ScienceToken.mysticism]: () => 2,
	[ScienceToken.philosophy]: () => 7,
};

function getMilitaryPoints(militaryDiff: number): number {
	if (militaryDiff <= 0) return 0;
	if (militaryDiff <= 2) return 2;
	if (militaryDiff <= 5) return 5;
	return 10;
}

function stealMoney(amount: number) {
	utils.getOpponent().money = Math.max(0, utils.getOpponent().money - amount);
}

export { store, utils, deal, getCost, getScore, stealMoney, getMilitaryPoints };
