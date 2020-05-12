import { utils, store } from ".";
import { PlayerType } from "./NewGame";

export interface CardType {
	name: string;
	age: Age;
	color: Color;
	cost: Resource[];
	upgradesTo?: Upgrade;
	upgradesFrom?: Upgrade;
	extra: {
		resource?: Resource[];
		resourceOptions?: Resource[];
		points?: number;
		military?: number;
		science?: Science;
		discount?: Resource[];
		f?: () => void;
		guild?: (player: PlayerType) => number;
		godUpgrade?: God;
	};
}

export enum Age {
	one = 1,
	two,
	three,
}

export enum Resource {
	money = "$",
	clay = "c",
	stone = "s",
	wood = "w",
	paper = "p",
	glass = "g",
}

export enum Color {
	brown = "brown",
	grey = "grey",
	yellow = "yellow",
	red = "red",
	blue = "blue",
	green = "green",
	purple = "purple",
	guild = "guild",
	god = "god",
}

enum Science {
	wheel,
	a,
	writing,
	bowl,
	astrolabe,
	tablet,
	law,
}

export enum Upgrade {
	lamp,
	target,
	water,
	crescent,
	mask,
	horseshoe,
	vase,
	barrel,
	helmet,
	sword,
	pillar,
	sun,
	crown,
	book,
	gear,
	capital,
	harp,
}

enum God {
	egyptian,
	mesopotamian,
	greek,
	roman,
	phoenician,
}

const structure: { [age in Age]?: number[][] } = {
	[Age.one]: [
		[4, 4],
		[3, 3, 3],
		[2, 2, 2, 2],
		[1, 1, 1, 1, 1],
		[0, 0, 0, 0, 0, 0],
	],
	[Age.two]: [
		[0, 0, 0, 0, 0, 0],
		[1, 1, 1, 1, 1],
		[2, 2, 2, 2],
		[3, 3, 3],
		[4, 4],
	],
	[Age.three]: [
		[2, 2],
		[1, 1, 1],
		[0, 0, 0, 0],
		[1, 3],
		[0, 0, 0, 0],
		[1, 1, 1],
		[2, 2],
	],
};

const cards: CardType[] = [
	{
		name: "lumber yard",
		age: Age.one,
		color: Color.brown,
		cost: [],
		extra: { resource: [Resource.wood] },
	},
	{
		name: "clay pool",
		age: Age.one,
		color: Color.brown,
		cost: [],
		extra: { resource: [Resource.clay] },
	},
	{
		name: "quarry",
		age: Age.one,
		color: Color.brown,
		cost: [],
		extra: { resource: [Resource.stone] },
	},
	{
		name: "logging camp",
		age: Age.one,
		color: Color.brown,
		cost: [Resource.money],
		extra: { resource: [Resource.wood] },
	},
	{
		name: "stone pit",
		age: Age.one,
		color: Color.brown,
		cost: [Resource.money],
		extra: { resource: [Resource.stone] },
	},
	{
		name: "clay pit",
		age: Age.one,
		color: Color.brown,
		cost: [Resource.money],
		extra: { resource: [Resource.clay] },
	},
	{
		name: "press",
		age: Age.one,
		color: Color.grey,
		cost: [Resource.money],
		extra: { resource: [Resource.paper] },
	},
	{
		name: "glassworks",
		age: Age.one,
		color: Color.grey,
		cost: [Resource.money],
		extra: { resource: [Resource.glass] },
	},
	{
		name: "baths",
		age: Age.one,
		color: Color.blue,
		cost: [Resource.stone],
		upgradesTo: Upgrade.water,
		extra: { points: 3 },
	},
	{
		name: "altar",
		age: Age.one,
		color: Color.blue,
		cost: [],
		upgradesTo: Upgrade.crescent,
		extra: { points: 3 },
	},
	{
		name: "theater",
		age: Age.one,
		color: Color.blue,
		cost: [],
		upgradesTo: Upgrade.mask,
		extra: { points: 3 },
	},
	{
		name: "guard tower",
		age: Age.one,
		color: Color.red,
		cost: [],
		extra: { military: 1 },
	},
	{
		name: "garrison",
		age: Age.one,
		color: Color.red,
		cost: [Resource.clay],
		upgradesTo: Upgrade.sword,
		extra: { military: 1 },
	},
	{
		name: "palisade",
		age: Age.one,
		color: Color.red,
		cost: [Resource.money, Resource.money],
		upgradesTo: Upgrade.crown,
		extra: { military: 1 },
	},
	{
		name: "stable",
		age: Age.one,
		color: Color.red,
		cost: [Resource.wood],
		upgradesTo: Upgrade.horseshoe,
		extra: { military: 1 },
	},
	{
		name: "stone reserve",
		age: Age.one,
		color: Color.yellow,
		cost: [Resource.money, Resource.money, Resource.money],
		extra: { discount: [Resource.stone] },
	},
	{
		name: "wood reserve",
		age: Age.one,
		color: Color.yellow,
		cost: [Resource.money, Resource.money, Resource.money],
		extra: { discount: [Resource.wood] },
	},
	{
		name: "clay reserve",
		age: Age.one,
		color: Color.yellow,
		cost: [Resource.money, Resource.money, Resource.money],
		extra: { discount: [Resource.clay] },
	},
	{
		name: "tavern",
		age: Age.one,
		color: Color.yellow,
		cost: [],
		extra: { f: () => (utils.getMe().money += 4) },
		upgradesTo: Upgrade.vase,
	},
	{
		name: "apothecary",
		age: Age.one,
		color: Color.green,
		cost: [Resource.glass],
		extra: { points: 1, science: Science.wheel },
	},
	{
		name: "workshop",
		age: Age.one,
		color: Color.green,
		cost: [Resource.paper],
		extra: { points: 1, science: Science.a },
	},
	{
		name: "scriptorium",
		age: Age.one,
		color: Color.green,
		cost: [Resource.money, Resource.money],
		extra: { science: Science.writing },
		upgradesTo: Upgrade.book,
	},
	{
		name: "pharmacist",
		age: Age.one,
		color: Color.green,
		cost: [Resource.money, Resource.money],
		extra: { science: Science.bowl },
		upgradesTo: Upgrade.gear,
	},
	{
		name: "sawmill",
		age: Age.two,
		color: Color.brown,
		cost: [Resource.money, Resource.money],
		extra: { resource: [Resource.wood, Resource.wood] },
	},
	{
		name: "brickyard",
		age: Age.two,
		color: Color.brown,
		cost: [Resource.money, Resource.money],
		extra: { resource: [Resource.clay, Resource.clay] },
	},
	{
		name: "shelf quarry",
		age: Age.two,
		color: Color.brown,
		cost: [Resource.money, Resource.money],
		extra: { resource: [Resource.stone, Resource.stone] },
	},
	{
		name: "drying room",
		age: Age.two,
		color: Color.grey,
		cost: [],
		extra: { resource: [Resource.paper] },
	},
	{
		name: "glassblower",
		age: Age.two,
		color: Color.grey,
		cost: [],
		extra: { resource: [Resource.glass] },
	},
	{
		name: "courthouse",
		age: Age.two,
		color: Color.blue,
		cost: [Resource.wood, Resource.wood, Resource.glass],
		extra: { points: 5 },
	},
	{
		name: "aqueduct",
		age: Age.two,
		color: Color.blue,
		cost: [Resource.stone, Resource.stone, Resource.stone],
		upgradesFrom: Upgrade.water,
		extra: { points: 5 },
	},
	{
		name: "statue",
		age: Age.two,
		color: Color.blue,
		cost: [Resource.clay, Resource.clay],
		upgradesFrom: Upgrade.mask,
		upgradesTo: Upgrade.pillar,
		extra: { points: 4 },
	},
	{
		name: "temple",
		age: Age.two,
		color: Color.blue,
		cost: [Resource.wood, Resource.paper],
		upgradesFrom: Upgrade.crescent,
		upgradesTo: Upgrade.sun,
		extra: { points: 4 },
	},
	{
		name: "rostrum",
		age: Age.two,
		color: Color.blue,
		cost: [Resource.stone, Resource.wood],
		upgradesTo: Upgrade.capital,
		extra: { points: 4 },
	},
	{
		name: "archery range",
		age: Age.two,
		color: Color.red,
		cost: [Resource.stone, Resource.wood, Resource.paper],
		upgradesTo: Upgrade.target,
		extra: { military: 2 },
	},
	{
		name: "barracks",
		age: Age.two,
		color: Color.red,
		cost: [Resource.money, Resource.money, Resource.money],
		upgradesFrom: Upgrade.sword,
		extra: { military: 1 },
	},
	{
		name: "walls",
		age: Age.two,
		color: Color.red,
		cost: [Resource.stone, Resource.stone],
		extra: { military: 2 },
	},
	{
		name: "horse breeders",
		age: Age.two,
		color: Color.red,
		cost: [Resource.wood, Resource.clay],
		upgradesTo: Upgrade.horseshoe,
		extra: { military: 1 },
	},
	{
		name: "parade ground",
		age: Age.two,
		color: Color.red,
		cost: [Resource.clay, Resource.clay, Resource.glass],
		upgradesTo: Upgrade.helmet,
		extra: { military: 2 },
	},
	{
		name: "forum",
		age: Age.two,
		color: Color.yellow,
		cost: [Resource.money, Resource.money, Resource.money, Resource.clay],
		extra: { resourceOptions: [Resource.glass, Resource.paper] },
	},
	{
		name: "caravansery",
		age: Age.two,
		color: Color.yellow,
		cost: [Resource.money, Resource.money, Resource.paper, Resource.glass],
		extra: {
			resourceOptions: [Resource.wood, Resource.clay, Resource.stone],
		},
	},
	{
		name: "customs house",
		age: Age.two,
		color: Color.yellow,
		cost: [Resource.money, Resource.money, Resource.money, Resource.money],
		extra: { discount: [Resource.glass, Resource.paper] },
	},
	{
		name: "brewery",
		age: Age.two,
		color: Color.yellow,
		cost: [],
		extra: { f: () => (utils.getMe().money += 6) },
		upgradesTo: Upgrade.barrel,
	},
	{
		name: "school",
		age: Age.two,
		color: Color.green,
		cost: [Resource.paper, Resource.paper, Resource.wood],
		extra: { points: 1, science: Science.wheel },
		upgradesTo: Upgrade.harp,
	},
	{
		name: "laboratory",
		age: Age.two,
		color: Color.green,
		cost: [Resource.wood, Resource.glass, Resource.glass],
		extra: { points: 1, science: Science.a },
		upgradesTo: Upgrade.lamp,
	},
	{
		name: "library",
		age: Age.two,
		color: Color.green,
		cost: [Resource.stone, Resource.wood, Resource.glass],
		extra: { points: 2, science: Science.writing },
		upgradesFrom: Upgrade.book,
	},
	{
		name: "dispensary",
		age: Age.two,
		color: Color.green,
		cost: [Resource.clay, Resource.clay, Resource.stone],
		extra: { points: 2, science: Science.bowl },
		upgradesFrom: Upgrade.gear,
	},
	{
		name: "pantheon",
		age: Age.three,
		color: Color.blue,
		cost: [Resource.clay, Resource.wood, Resource.paper, Resource.paper],
		extra: { points: 6 },
		upgradesFrom: Upgrade.sun,
	},
	{
		name: "obelisk",
		age: Age.three,
		color: Color.blue,
		cost: [Resource.stone, Resource.stone, Resource.glass],
		extra: { points: 5 },
	},
	{
		name: "obelisk",
		age: Age.three,
		color: Color.blue,
		cost: [Resource.clay, Resource.clay, Resource.stone, Resource.paper],
		extra: { points: 5 },
		upgradesFrom: Upgrade.capital,
	},
	{
		name: "gardens",
		age: Age.three,
		color: Color.blue,
		cost: [Resource.clay, Resource.clay, Resource.wood, Resource.wood],
		extra: { points: 6 },
		upgradesFrom: Upgrade.pillar,
	},
	{
		name: "palace",
		age: Age.three,
		color: Color.blue,
		cost: [
			Resource.clay,
			Resource.wood,
			Resource.stone,
			Resource.glass,
			Resource.glass,
		],
		extra: { points: 7 },
	},
	{
		name: "town hall",
		age: Age.three,
		color: Color.blue,
		cost: [
			Resource.stone,
			Resource.stone,
			Resource.stone,
			Resource.wood,
			Resource.wood,
		],
		extra: { points: 7 },
	},
	{
		name: "fortifications",
		age: Age.three,
		color: Color.red,
		cost: [Resource.stone, Resource.stone, Resource.clay, Resource.paper],
		extra: { military: 2 },
		upgradesFrom: Upgrade.crown,
	},
	{
		name: "pretorium",
		age: Age.three,
		color: Color.red,
		cost: [
			Resource.money,
			Resource.money,
			Resource.money,
			Resource.money,
			Resource.money,
			Resource.money,
			Resource.money,
			Resource.money,
		],
		extra: { military: 3 },
	},
	{
		name: "arsenal",
		age: Age.three,
		color: Color.red,
		cost: [
			Resource.clay,
			Resource.clay,
			Resource.clay,
			Resource.wood,
			Resource.wood,
		],
		extra: { military: 3 },
	},
	{
		name: "siege workshop",
		age: Age.three,
		color: Color.red,
		cost: [Resource.wood, Resource.wood, Resource.wood, Resource.glass],
		extra: { military: 2 },
		upgradesFrom: Upgrade.target,
	},
	{
		name: "circus",
		age: Age.three,
		color: Color.red,
		cost: [Resource.clay, Resource.clay, Resource.stone, Resource.stone],
		extra: { military: 2 },
		upgradesFrom: Upgrade.helmet,
	},
	{
		name: "lighthouse",
		age: Age.three,
		color: Color.yellow,
		cost: [Resource.clay, Resource.clay, Resource.glass],
		extra: {
			points: 3,
			f: () =>
				(utils.getMe().money += utils
					.getMe()
					.cards.filter(
						(cardIndex) => cards[cardIndex].color === Color.yellow
					).length),
		},
		upgradesFrom: Upgrade.vase,
	},
	{
		name: "arena",
		age: Age.three,
		color: Color.yellow,
		cost: [Resource.clay, Resource.stone, Resource.wood],
		extra: {
			points: 3,
			f: () =>
				(utils.getMe().money +=
					2 *
					utils.getMe().wonders.filter((wonder) => wonder.built)
						.length),
		},
		upgradesFrom: Upgrade.barrel,
	},
	{
		name: "port",
		age: Age.three,
		color: Color.yellow,
		cost: [Resource.wood, Resource.glass, Resource.paper],
		extra: {
			points: 3,
			f: () =>
				(utils.getMe().money +=
					2 *
					utils
						.getMe()
						.cards.filter(
							(cardIndex) =>
								cards[cardIndex].color === Color.brown
						).length),
		},
	},
	{
		name: "armory",
		age: Age.three,
		color: Color.yellow,
		cost: [Resource.stone, Resource.stone, Resource.glass],
		extra: {
			points: 3,
			f: () =>
				(utils.getMe().money += utils
					.getMe()
					.cards.filter(
						(cardIndex) => cards[cardIndex].color === Color.red
					).length),
		},
	},
	{
		name: "chamber of commerce",
		age: Age.three,
		color: Color.yellow,
		cost: [Resource.paper, Resource.paper],
		extra: {
			points: 3,
			f: () =>
				(utils.getMe().money +=
					3 *
					utils
						.getMe()
						.cards.filter(
							(cardIndex) => cards[cardIndex].color === Color.grey
						).length),
		},
	},
	{
		name: "observatory",
		age: Age.three,
		color: Color.green,
		cost: [Resource.stone, Resource.paper, Resource.paper],
		extra: { points: 2, science: Science.astrolabe },
		upgradesFrom: Upgrade.lamp,
	},
	{
		name: "university",
		age: Age.three,
		color: Color.green,
		cost: [Resource.clay, Resource.glass, Resource.paper],
		extra: { points: 2, science: Science.astrolabe },
		upgradesFrom: Upgrade.harp,
	},
	{
		name: "study",
		age: Age.three,
		color: Color.green,
		cost: [Resource.wood, Resource.wood, Resource.glass, Resource.paper],
		extra: { points: 3, science: Science.tablet },
	},
	{
		name: "academy",
		age: Age.three,
		color: Color.green,
		cost: [Resource.stone, Resource.wood, Resource.glass, Resource.glass],
		extra: { points: 3, science: Science.tablet },
	},
	{
		name: "moneylenders guild",
		age: Age.three,
		color: Color.guild,
		cost: [Resource.stone, Resource.stone, Resource.wood, Resource.wood],
		extra: { guild: (player: PlayerType) => Math.floor(player.money / 3) },
	},
	{
		name: "merchants guild",
		age: Age.three,
		color: Color.guild,
		cost: [Resource.clay, Resource.wood, Resource.glass, Resource.paper],
		extra: {
			guild: (player: PlayerType) =>
				player.cards.filter(
					(cardIndex) => cards[cardIndex].color === Color.yellow
				).length,
			f: () =>
				(utils.getMe().money += Math.max(
					store.gameW.game.players.map(
						(player) =>
							player.cards.filter(
								(cardIndex) =>
									cards[cardIndex].color === Color.yellow
							).length
					).length
				)),
		},
	},
	{
		name: "shipowners guild",
		age: Age.three,
		color: Color.guild,
		cost: [Resource.clay, Resource.stone, Resource.glass, Resource.paper],
		extra: {
			guild: (player: PlayerType) =>
				player.cards.filter(
					(cardIndex) =>
						cards[cardIndex].color === Color.brown ||
						cards[cardIndex].color === Color.grey
				).length,
			f: () =>
				(utils.getMe().money += Math.max(
					store.gameW.game.players.map(
						(player) =>
							player.cards.filter(
								(cardIndex) =>
									cards[cardIndex].color === Color.brown ||
									cards[cardIndex].color === Color.grey
							).length
					).length
				)),
		},
	},
	{
		name: "tacticians guild",
		age: Age.three,
		color: Color.guild,
		cost: [Resource.stone, Resource.stone, Resource.clay, Resource.paper],
		extra: {
			guild: (player: PlayerType) =>
				player.cards.filter(
					(cardIndex) => cards[cardIndex].color === Color.red
				).length,
			f: () =>
				(utils.getMe().money += Math.max(
					store.gameW.game.players.map(
						(player) =>
							player.cards.filter(
								(cardIndex) =>
									cards[cardIndex].color === Color.red
							).length
					).length
				)),
		},
	},
	{
		name: "scientists guild",
		age: Age.three,
		color: Color.guild,
		cost: [Resource.clay, Resource.clay, Resource.wood, Resource.wood],
		extra: {
			guild: (player: PlayerType) =>
				player.cards.filter(
					(cardIndex) => cards[cardIndex].color === Color.green
				).length,
			f: () =>
				(utils.getMe().money += Math.max(
					store.gameW.game.players.map(
						(player) =>
							player.cards.filter(
								(cardIndex) =>
									cards[cardIndex].color === Color.green
							).length
					).length
				)),
		},
	},
	{
		name: "magistrates guild",
		age: Age.three,
		color: Color.guild,
		cost: [Resource.wood, Resource.wood, Resource.clay, Resource.paper],
		extra: {
			guild: (player: PlayerType) =>
				player.cards.filter(
					(cardIndex) => cards[cardIndex].color === Color.blue
				).length,
			f: () =>
				(utils.getMe().money += Math.max(
					store.gameW.game.players.map(
						(player) =>
							player.cards.filter(
								(cardIndex) =>
									cards[cardIndex].color === Color.blue
							).length
					).length
				)),
		},
	},
	{
		name: "builders guild",
		age: Age.three,
		color: Color.guild,
		cost: [
			Resource.stone,
			Resource.stone,
			Resource.clay,
			Resource.wood,
			Resource.glass,
		],
		extra: {
			guild: (player: PlayerType) =>
				2 * player.wonders.filter((wonder) => wonder.built).length,
		},
	},
	{
		name: "egyptian grand temple",
		age: Age.three,
		color: Color.god,
		cost: [
			Resource.clay,
			Resource.clay,
			Resource.clay,
			Resource.glass,
			Resource.paper,
		],
		extra: { godUpgrade: God.egyptian },
	},
	{
		name: "phoenician grand temple",
		age: Age.three,
		color: Color.god,
		cost: [
			Resource.wood,
			Resource.stone,
			Resource.glass,
			Resource.paper,
			Resource.paper,
		],
		extra: { godUpgrade: God.phoenician },
	},
	{
		name: "meopotamian grand temple",
		age: Age.three,
		color: Color.god,
		cost: [
			Resource.wood,
			Resource.wood,
			Resource.wood,
			Resource.glass,
			Resource.paper,
		],
		extra: { godUpgrade: God.mesopotamian },
	},
	{
		name: "roman grand temple",
		age: Age.three,
		color: Color.god,
		cost: [
			Resource.clay,
			Resource.stone,
			Resource.glass,
			Resource.glass,
			Resource.paper,
		],
		extra: { godUpgrade: God.roman },
	},
	{
		name: "greek grand temple",
		age: Age.three,
		color: Color.god,
		cost: [
			Resource.stone,
			Resource.stone,
			Resource.stone,
			Resource.glass,
			Resource.paper,
		],
		extra: { godUpgrade: God.greek },
	},
];

export type WonderType = {
	name: string;
	cost: Resource[];
	f: () => void;
	goAgain?: boolean;
	points?: number;
};

const wonders: WonderType[] = [
	{
		name: "the temple of artemis",
		cost: [Resource.paper, Resource.glass, Resource.stone, Resource.paper],
		f: () => (utils.getMe().money += 12),
		goAgain: true,
	},
	{
		name: "circus maximus",
		cost: [Resource.glass, Resource.wood, Resource.stone, Resource.stone],
		f: () => alert("increase military and destroy a grey card"),
		points: 3,
	},
	{
		name: "the statue of zeus",
		cost: [
			Resource.paper,
			Resource.paper,
			Resource.clay,
			Resource.wood,
			Resource.stone,
		],
		f: () => alert("increase military and destroy a brown card"),
		points: 3,
	},
	{
		name: "the hanging gardens",
		cost: [Resource.paper, Resource.glass, Resource.wood, Resource.wood],
		f: () => (utils.getMe().money += 6),
		goAgain: true,
		points: 3,
	},
	{
		name: "the great lighthouse",
		cost: [Resource.paper, Resource.paper, Resource.stone, Resource.wood],
		f: () => alert("extra brown resource"),
		points: 4,
	},
	{
		name: "piraeus",
		cost: [Resource.clay, Resource.stone, Resource.wood, Resource.wood],
		f: () => alert("extra grey resource"),
		goAgain: true,
		points: 2,
	},
	{
		name: "the sanctuary",
		cost: [Resource.paper, Resource.glass, Resource.stone, Resource.stone],
		f: () => alert("2 discount on gods"),
		goAgain: true,
	},
	{
		name: "the mausoleum",
		cost: [
			Resource.paper,
			Resource.glass,
			Resource.glass,
			Resource.clay,
			Resource.clay,
		],
		f: () => alert("build from discard"),
		points: 2,
	},
	{
		name: "the appian way",
		cost: [
			Resource.paper,
			Resource.clay,
			Resource.clay,
			Resource.stone,
			Resource.stone,
		],
		f: () => {
			const myIndex = utils.myIndex();
			store.gameW.game.players[myIndex].money += 3;
			store.gameW.game.players[1 - myIndex].money = Math.max(
				store.gameW.game.players[1 - myIndex].money - 3,
				0
			);
		},
		points: 3,
		goAgain: true,
	},
	{
		name: "the pyramids",
		cost: [Resource.paper, Resource.stone, Resource.stone, Resource.stone],
		f: () => null,
		points: 9,
	},
	{
		name: "the sphinx",
		cost: [Resource.glass, Resource.glass, Resource.clay, Resource.stone],
		f: () => null,
		points: 6,
		goAgain: true,
	},
	{
		name: "the great library",
		cost: [Resource.paper, Resource.glass, Resource.wood, Resource.wood],
		f: () => alert("choose a science token"),
		points: 4,
	},
	{
		name: "the colossus",
		cost: [Resource.glass, Resource.clay, Resource.clay, Resource.clay],
		f: () => alert("increase military by 2"),
		points: 3,
	},
	{
		name: "the divine theater",
		cost: [
			Resource.paper,
			Resource.paper,
			Resource.glass,
			Resource.wood,
			Resource.wood,
		],
		f: () => alert("pick a god"),
		points: 2,
	},
];

export default { cards, structure, wonders };
