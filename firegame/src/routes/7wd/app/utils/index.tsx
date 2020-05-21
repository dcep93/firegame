import Shared from "../../../../shared";
import store_, { StoreType } from "../../../../shared/store";
import {
	GameType,
	PlayerType,
	Age,
	Resource,
	CardType,
	ScienceToken,
	Color,
	WonderType,
	CommercialType,
	ScienceEnum,
	CommercialEnum,
} from "./types";
import bank from "./bank";

const BASE_COST = 2;
const CARDS_PER_AGE = 20;
const NUM_PURPLES = 3;
const SCIENCE_TO_WIN = 6;

class Utils extends Shared<GameType, PlayerType> {
	tokenToPoints: {
		[token in ScienceToken]?: (player: PlayerType) => number;
	} = {
		[ScienceToken.agriculture]: () => 4,
		[ScienceToken.mathematics]: (player: PlayerType) =>
			(player.scienceTokens || []).length,
		[ScienceToken.mysticism]: (player: PlayerType) =>
			2 * (player.tokens || []).length,
		[ScienceToken.philosophy]: () => 7,
	};

	getMilitaryPoints(militaryDiff: number): number {
		if (militaryDiff <= 0) return 0;
		if (militaryDiff <= 2) return 2;
		if (militaryDiff <= 5) return 5;
		return 10;
	}

	currentIndex(game_: GameType | undefined = undefined): number {
		const game: GameType = game_ || store.gameW.game!;
		if (game && game.commercials) return game.commercials[0].playerIndex;
		return super.currentIndex(game_);
	}

	endCommercial(message: string) {
		if (!utils.isMyTurn()) return;
		store.gameW.game.commercials!.shift();
		store.update(message);
	}

	getOpponent(game_: GameType | undefined = undefined) {
		return this.getPlayer(1 - this.myIndex(game_));
	}

	deal(game: GameType) {
		const indices = utils.shuffle(
			bank.cards
				.map((card, index) => ({ card, index }))
				.filter((ic) => ic.card.age === game.age)
				.map((ic) => ic.index)
		);
		const cardsToUse = indices.splice(0, CARDS_PER_AGE);
		if (game.age === Age.two && game.params.godExpansion)
			utils.assignGate(game);
		if (game.age === Age.three) {
			const matchAge = game.params.godExpansion ? Age.god : Age.guild;
			const purples = bank.cards
				.map((card, index) => ({ card, index }))
				.filter((ic) => ic.card.age === matchAge)
				.map((ic) => ic.index);
			cardsToUse.push(...purples.splice(0, NUM_PURPLES));
			utils.shuffle(cardsToUse);
		}
		game.structure = bank.structure[game.age]!.map(
			(mapRow: number[], rowIndex: number) =>
				mapRow.map((offset) => ({
					offset,
					cardIndex: cardsToUse.pop()!,
					revealed: rowIndex % 2 === 0,
					taken: false,
				}))
		);
		var wentFirst;
		const militaryDiff =
			utils.getMe().military - utils.getOpponent().military;
		if (militaryDiff > 0) {
			wentFirst = utils.getOpponent().index;
		} else if (militaryDiff < 0) {
			wentFirst = utils.getMe().index;
		} else {
			wentFirst = 1 - game.wentFirst;
		}
		game.currentPlayer = game.wentFirst = wentFirst;
	}

	assignGate(game: GameType) {
		for (let index = 0; index < game.pantheon.length; index++) {
			if (game.pantheon[index] === -1) {
				game.pantheon[index] = bank.gods
					.map((god, godIndex) => ({ god, godIndex }))
					.find((obj) => obj.god.source === undefined)!.godIndex;
				return;
			}
		}
	}

	getCostCost(rawCosts: Resource[]): number {
		const cards = utils.getMe().cards || [];
		const costs = utils.countResources(rawCosts);
		const myResources = utils.countResources(
			cards.flatMap(
				(cardIndex) => bank.cards[cardIndex].extra.resource || []
			)
		);
		const oppResources = utils.countResources(
			(utils.getOpponent().cards || []).flatMap(
				(cardIndex) => bank.cards[cardIndex].extra.resource || []
			)
		);
		const discounts = cards.flatMap(
			(cardIndex) => bank.cards[cardIndex].extra.discount || []
		);

		var price = costs[Resource.money] || 0;
		delete costs[Resource.money];

		const paid: {
			[r in Resource]?: { pricePer: number; needed: number };
		} = {};
		Object.keys(costs).forEach((r) => {
			const resource: Resource = r as Resource;
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
			.concat(this.getWonderOptions())
			.filter(Boolean)
			.forEach((options) => {
				var pricePer = 0;
				var resource: Resource | null = null;
				Object.entries(paid).forEach(([r_, o]) => {
					const r: Resource = r_ as Resource;
					if (o!.needed < 0 || !options?.includes(r)) return;
					if (o!.pricePer > pricePer) {
						pricePer = o!.pricePer;
						resource = r;
					}
				});
				if (resource === null) return;
				const picked: { pricePer: number; needed: number } =
					paid[resource];
				picked.needed--;
				price -= pricePer;
			});
		return price;
	}

	getWonderOptions(): Resource[][] {
		return (utils.getMe().wonders || [])
			.filter((wonder) => wonder.built)
			.map((wonder) => bank.wonders[wonder.wonderIndex])
			.map((wonder) => wonder.resourceOptions)
			.filter(Boolean) as Resource[][];
	}

	getCardCost(card: CardType): number {
		if (!utils.getMe()) return 0;
		if (
			(utils.getMe().cards || []).find(
				(cardIndex) =>
					card.upgradesFrom &&
					bank.cards[cardIndex].upgradesTo === card.upgradesFrom
			)
		)
			return 0;
		if (
			(utils.getMe().scienceTokens || []).includes(
				ScienceToken.masonry
			) &&
			card.color === Color.blue
		)
			return 0;
		const price = utils.getCostCost(card.cost);
		if (
			card.upgradesFrom &&
			(utils.getMe().scienceTokens || []).includes(
				ScienceToken.engineering
			) &&
			price > 0
		)
			return 1;
		return price;
	}

	countResources(pool: Resource[]): { [r in Resource]?: number } {
		const resources: { [r in Resource]?: number } = {};
		pool.forEach((resource) => {
			resources[resource] = (resources[resource] || 0) + 1;
		});
		return resources;
	}

	getScore(player: PlayerType): number {
		const cardPoints = (player.cards || [])
			.map((cardIndex) => bank.cards[cardIndex].extra.points || 0)
			.reduce((a, b) => a + b, 0);
		const moneyPoints = Math.floor(player.money / 3);
		const guildPoints = (player.cards || [])
			.map((cardIndex) => bank.cards[cardIndex].extra.guild)
			.filter(Boolean)
			.map((g) => Math.max(g!(utils.getMe()), g!(utils.getOpponent())))
			.reduce((a, b) => a + b, 0);
		const militaryPoints = utils.getMilitaryPoints(
			player.military -
				store.gameW.game.players[1 - player.index].military
		);
		const sciencePoints = (player.scienceTokens || [])
			.map((token) => utils.tokenToPoints[token])
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

	stealMoney(amount: number) {
		utils.getOpponent().money = Math.max(
			0,
			utils.getOpponent().money - amount
		);
	}

	getWonderCost(wonder: WonderType): number {
		if (!utils.getMe()) return 0;
		if (
			(utils.getMe().scienceTokens || []).includes(
				ScienceToken.architecture
			)
		)
			return 0;
		return utils.getCostCost(wonder.cost);
	}

	increaseMilitary(military: number) {
		const me = utils.getMe();
		const sciences = me.scienceTokens || [];
		if (sciences.includes(ScienceToken.polioretics))
			utils.stealMoney(military);

		for (
			let diff = me.military - utils.getOpponent().military;
			diff < military;
			diff++
		) {
			if (
				utils.myIndex() === 0
					? diff
					: -diff === store.gameW.game.minerva
			) {
				delete store.gameW.game.minerva;
				return;
			}
			const bonus = me.militaryBonuses[diff];
			if (bonus !== undefined) {
				delete me.militaryBonuses[diff];
				if (bonus === 0) return alert("you win");
				utils.stealMoney(bonus);
			}
		}
	}

	addCommercial(commercial: CommercialType) {
		if (!store.gameW.game.commercials) store.gameW.game.commercials = [];
		store.gameW.game.commercials.push(commercial);
	}

	enumName<T>(val: string, e: T): keyof T {
		return Object.entries(e).find(([k, v]) => v === val)![0] as keyof T;
	}

	gainScience(science: ScienceEnum) {
		const me = utils.getMe();
		if (!me.scienceIcons) me.scienceIcons = {};
		if (!me.scienceIcons[science]) me.scienceIcons[science] = 0;
		if (me.scienceIcons[science]!++ === 2) {
			if (!store.gameW.game.commercials)
				store.gameW.game.commercials = [];
			store.gameW.game.commercials.push({
				commercial: CommercialEnum.science,
				playerIndex: utils.myIndex(),
			});
		} else if (Object.keys(me.scienceIcons).length === SCIENCE_TO_WIN) {
			alert("you win!");
		}
	}

	isMyCommercial(commercial: CommercialEnum): boolean {
		if (!store.gameW.game.commercials) return false;
		return (
			utils.isMyTurn() &&
			store.gameW.game.commercials[0]?.commercial === commercial
		);
	}

	buyGod(selectedPantheon: number) {
		const godIndex = store.gameW.game.pantheon[selectedPantheon];
		const god = bank.gods[godIndex];
		const me = utils.getMe();
		var cost =
			3 +
			(utils.myIndex() === 0 ? 5 - selectedPantheon : selectedPantheon);
		if (god.source === undefined) cost *= 2;
		if (
			(utils.getMe().gods || []).find(
				(godIndex) => bank.gods[godIndex].name === "the sanctuary"
			)
		)
			cost -= 2;
		if (me.money < cost) return alert("cannot afford");
		me.money -= cost;
		if (!me.gods) me.gods = [];
		me.gods.push(godIndex);
		god.f(god);
		utils.incrementPlayerTurn();
		store.update(`purchased ${god.name}`);
	}

	takeToken(row: number, col: number) {
		const game = store.gameW.game;
		const me = utils.getMe();
		if (!me.tokens) me.tokens = [];
		if (game.age === Age.one) {
			if (col % 2 === 0) {
				utils.addCommercial({
					commercial: CommercialEnum.pickGod,
					playerIndex: utils.myIndex(),
				});
			}
		} else if (game.age === Age.two) {
			if (col % 2 === 0 && row === 1) {
				me.tokens.push({ isGod: false, value: game.discounts.pop()! });
			}
		}
	}

	canTakeCard(y: number, x: number, offset: number): boolean {
		const rowBelow = store.gameW.game.structure[y + 1];
		if (!rowBelow) return true;
		const gridX = x * 2 + offset;
		const cardsBelow = rowBelow.filter(
			(card, index) =>
				!card.taken && Math.abs(card.offset + index * 2 - gridX) === 1
		);
		return cardsBelow.length === 0;
	}

	handleCardPurchase(card: CardType) {
		const me = utils.getMe();
		const sciences = me.scienceTokens || [];
		if (card.extra.f) card.extra.f();
		if (
			card.upgradesFrom !== undefined &&
			(me.scienceTokens || []).includes(ScienceToken.urbanism)
		) {
			if (
				me.cards!.filter(
					(cardIndex) =>
						bank.cards[cardIndex].upgradesTo === card.upgradesFrom
				).length
			)
				me.money += 4;
		}
		if (card.extra.military) {
			var military = card.extra.military;
			if (sciences.includes(ScienceToken.strategy)) military++;
			utils.increaseMilitary(military);
		}
		if (card.extra.science) {
			utils.gainScience(card.extra.science);
		}
	}
}

export const store: StoreType<GameType> = store_;
const utils = new Utils();
export default utils;
