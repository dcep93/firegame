import Shared from "../../../../shared";
import store_, { StoreType } from "../../../../shared/store";

import { GameType, PlayerType, CommercialType } from "./NewGame";
import bank, {
	CardType,
	Resource,
	ScienceToken,
	Color,
	Age,
	WonderType,
} from "./bank";

const BASE_COST = 2;

class Utils extends Shared<GameType, PlayerType> {
	isMyTurn(game_: GameType | undefined = undefined): boolean {
		const game: GameType = game_ || store.gameW.game!;
		if (game && game.commercials)
			return game.commercials[0].playerIndex === this.myIndex(game);
		return super.isMyTurn(game_);
	}

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
	const cardsToUse = indices.splice(0, 20);
	if (game.age === Age.two && game.params.godExpansion) {
		assignGate(game);
	}
	if (game.age === Age.three) {
		const matchAge = game.params.godExpansion ? Age.god : Age.guild;
		const purples = bank.cards
			.map((card, index) => ({ card, index }))
			.filter((ic) => ic.card.age === matchAge)
			.map((ic) => ic.index);
		for (let i = 0; i < 3; i++) {
			cardsToUse.splice(i, 1, purples.pop()!);
		}
		utils.shuffle(cardsToUse);
	}
	game.structure = bank.structure[game.age]!.map((mapRow, rowIndex) =>
		mapRow.map((offset) => ({
			offset,
			cardIndex: cardsToUse.pop()!,
			revealed: rowIndex % 2 === 0,
			taken: false,
		}))
	);
	var wentFirst;
	const militaryDiff = utils.getMe().military - utils.getOpponent().military;
	if (militaryDiff > 0) {
		wentFirst = utils.getOpponent().index;
	} else if (militaryDiff < 0) {
		wentFirst = utils.getMe().index;
	} else {
		wentFirst = 1 - game.wentFirst;
	}
	game.currentPlayer = wentFirst;
	game.wentFirst = wentFirst;
}

function assignGate(game: GameType) {
	for (let index = 0; index < game.pantheon.length; index++) {
		if (game.pantheon[index] === -1) {
			game.pantheon[index] = bank.gods
				.map((god, godIndex) => ({ god, godIndex }))
				.filter((obj) => obj.god.source === undefined)
				.map((obj) => obj.godIndex)[0];
			return;
		}
	}
}

function getCostCost(rawCosts: Resource[]): number {
	const cards = utils.getMe().cards || [];
	const costs = countResources(rawCosts);
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
	return price;
}

function getCardCost(card: CardType): number {
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
	const price = getCostCost(card.cost);
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
	const wonderPoints = (player.wonders || [])
		.filter((wonder) => wonder.built)
		.map((wonder) => bank.wonders[wonder.wonderIndex].points || 0)
		.reduce((a, b) => a + b, 0);
	const godPoints = (player.gods || [])
		.map((godIndex) => bank.gods[godIndex])
		.filter((god) => god.points)
		.map((god) => god.points!(god))
		.reduce((a, b) => a + b, 0);
	return (
		cardPoints +
		moneyPoints +
		guildPoints +
		militaryPoints +
		sciencePoints +
		wonderPoints +
		godPoints
	);
}

const tokenToPoints: {
	[token in ScienceToken]?: (player: PlayerType) => number;
} = {
	[ScienceToken.agriculture]: () => 4,
	[ScienceToken.mathematics]: (player: PlayerType) =>
		(player.sciences || []).length,
	[ScienceToken.mysticism]: (player: PlayerType) =>
		2 * (player.tokens || []).length,
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

function getWonderCost(wonder: WonderType): number {
	if ((utils.getMe().sciences || []).includes(ScienceToken.architecture))
		return 0;
	return getCostCost(wonder.cost);
}

function increaseMilitary(military: number) {
	if (store.gameW.game.minerva) {
		delete store.gameW.game.minerva;
		return;
	}
	const me = utils.getMe();
	const sciences = me.sciences || [];
	if (sciences.includes(ScienceToken.polioretics)) stealMoney(military);
	me.military += military;

	const militaryDiff = me.military - utils.getOpponent().military;
	Object.entries(me.militaryBonuses).forEach(([needed, amount]) => {
		const key = parseInt(needed);
		if (militaryDiff >= key) {
			if (!amount) return alert("you win");
			stealMoney(amount);
			delete me.militaryBonuses[key];
		}
	});
}

function addCommercial(commercial: CommercialType) {
	if (!store.gameW.game.commercials) store.gameW.game.commercials = [];
	store.gameW.game.commercials.push(commercial);
}

export {
	store,
	utils,
	deal,
	getCardCost,
	getScore,
	stealMoney,
	getMilitaryPoints,
	getWonderCost,
	increaseMilitary,
	addCommercial,
};
