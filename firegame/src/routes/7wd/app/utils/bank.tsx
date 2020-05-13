import { utils, store, stealMoney, increaseMilitary } from ".";
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
		science?: ScienceEnum;
		discount?: Resource[];
		f?: () => void;
		guild?: (player: PlayerType) => number;
		godUpgrade?: God;
	};
	message?: string;
}

export enum Age {
	one = 1,
	two,
	three,
	guild,
	god,
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
}

export enum ScienceEnum {
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

export enum God {
	egyptian,
	mesopotamian,
	greek,
	roman,
	phoenician,
}

export enum ScienceToken {
	agriculture,
	mathematics,
	urbanism,
	polioretics,
	architecture,
	law,
	economy,
	masonry,
	mysticism,
	engineering,
	philosophy,
	theology,
	strategy,
}

const sciences: { [token in ScienceToken]: string } = {
	[ScienceToken.agriculture]: "$6 + 4 points",
	[ScienceToken.mathematics]: "3 points / science token",
	[ScienceToken.urbanism]: "$6 + $4 when upgrading",
	[ScienceToken.polioretics]: "siege $1 / military",
	// todo
	[ScienceToken.architecture]: "free wonders",
	[ScienceToken.law]: "extra science symbol",
	[ScienceToken.economy]: "opponents pay you when buying",
	[ScienceToken.masonry]: "free blue cards",
	[ScienceToken.mysticism]: "2 points per god token",
	[ScienceToken.engineering]: "upgrades cost $1",
	[ScienceToken.philosophy]: "7 points",
	// todo
	[ScienceToken.theology]: "go again when building wonder",
	[ScienceToken.strategy]: "military moves extra",
};

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
		message: "$4",
		upgradesTo: Upgrade.vase,
	},
	{
		name: "apothecary",
		age: Age.one,
		color: Color.green,
		cost: [Resource.glass],
		extra: { points: 1, science: ScienceEnum.wheel },
	},
	{
		name: "workshop",
		age: Age.one,
		color: Color.green,
		cost: [Resource.paper],
		extra: { points: 1, science: ScienceEnum.a },
	},
	{
		name: "scriptorium",
		age: Age.one,
		color: Color.green,
		cost: [Resource.money, Resource.money],
		extra: { science: ScienceEnum.writing },
		upgradesTo: Upgrade.book,
	},
	{
		name: "pharmacist",
		age: Age.one,
		color: Color.green,
		cost: [Resource.money, Resource.money],
		extra: { science: ScienceEnum.bowl },
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
		message: "$6",
		upgradesTo: Upgrade.barrel,
	},
	{
		name: "school",
		age: Age.two,
		color: Color.green,
		cost: [Resource.paper, Resource.paper, Resource.wood],
		extra: { points: 1, science: ScienceEnum.wheel },
		upgradesTo: Upgrade.harp,
	},
	{
		name: "laboratory",
		age: Age.two,
		color: Color.green,
		cost: [Resource.wood, Resource.glass, Resource.glass],
		extra: { points: 1, science: ScienceEnum.a },
		upgradesTo: Upgrade.lamp,
	},
	{
		name: "library",
		age: Age.two,
		color: Color.green,
		cost: [Resource.stone, Resource.wood, Resource.glass],
		extra: { points: 2, science: ScienceEnum.writing },
		upgradesFrom: Upgrade.book,
	},
	{
		name: "dispensary",
		age: Age.two,
		color: Color.green,
		cost: [Resource.clay, Resource.clay, Resource.stone],
		extra: { points: 2, science: ScienceEnum.bowl },
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
		message: "$1 / yellow",
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
		message: "$2 / wonder",
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
		message: "$2 / brown",
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
		message: "$1 / red",
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
		message: "$3 / grey",
	},
	{
		name: "observatory",
		age: Age.three,
		color: Color.green,
		cost: [Resource.stone, Resource.paper, Resource.paper],
		extra: { points: 2, science: ScienceEnum.astrolabe },
		upgradesFrom: Upgrade.lamp,
	},
	{
		name: "university",
		age: Age.three,
		color: Color.green,
		cost: [Resource.clay, Resource.glass, Resource.paper],
		extra: { points: 2, science: ScienceEnum.astrolabe },
		upgradesFrom: Upgrade.harp,
	},
	{
		name: "study",
		age: Age.three,
		color: Color.green,
		cost: [Resource.wood, Resource.wood, Resource.glass, Resource.paper],
		extra: { points: 3, science: ScienceEnum.tablet },
	},
	{
		name: "academy",
		age: Age.three,
		color: Color.green,
		cost: [Resource.stone, Resource.wood, Resource.glass, Resource.glass],
		extra: { points: 3, science: ScienceEnum.tablet },
	},
	{
		name: "moneylenders guild",
		age: Age.guild,
		color: Color.purple,
		cost: [Resource.stone, Resource.stone, Resource.wood, Resource.wood],
		extra: {
			guild: (player: PlayerType) => Math.floor(player.money / 3),
		},
		message: "1 point / $3",
	},
	{
		name: "merchants guild",
		age: Age.guild,
		color: Color.purple,
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
		message: "$1, 1 point / yellow (both)",
	},
	{
		name: "shipowners guild",
		age: Age.guild,
		color: Color.purple,
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
		message: "$1, 1 point / brown/grey (both)",
	},
	{
		name: "tacticians guild",
		age: Age.guild,
		color: Color.purple,
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
		message: "$1, 1 point / red (both)",
	},
	{
		name: "scientists guild",
		age: Age.guild,
		color: Color.purple,
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
		message: "$1, 1 point / green (both)",
	},
	{
		name: "magistrates guild",
		age: Age.guild,
		color: Color.purple,
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
		message: "$1, 1 point / blue (both)",
	},
	{
		name: "builders guild",
		age: Age.guild,
		color: Color.purple,
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
		message: "2 points / wonder (both)",
	},
	{
		name: "egyptian grand temple",
		age: Age.god,
		color: Color.purple,
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
		age: Age.god,
		color: Color.purple,
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
		age: Age.god,
		color: Color.purple,
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
		age: Age.god,
		color: Color.purple,
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
		age: Age.god,
		color: Color.purple,
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
	message: string;
	f: () => void;
	goAgain?: boolean;
	points?: number;
};

const wonders: WonderType[] = [
	{
		name: "the temple of artemis",
		message: "$12, go again",
		cost: [Resource.paper, Resource.glass, Resource.stone, Resource.paper],
		f: () => (utils.getMe().money += 12),
		goAgain: true,
	},
	{
		name: "circus maximus",
		message: "military +1 and destroy a grey card",
		cost: [Resource.glass, Resource.wood, Resource.stone, Resource.stone],
		// todo
		f: () => alert("increase military and destroy a grey card"),
		points: 3,
	},
	{
		name: "the statue of zeus",
		message: "military +1 and destroy a brown card",
		cost: [
			Resource.paper,
			Resource.paper,
			Resource.clay,
			Resource.wood,
			Resource.stone,
		],
		// todo
		f: () => alert("increase military and destroy a brown card"),
		points: 3,
	},
	{
		name: "the hanging gardens",
		message: "$6, 3 points, go again",
		cost: [Resource.paper, Resource.glass, Resource.wood, Resource.wood],
		f: () => (utils.getMe().money += 6),
		goAgain: true,
		points: 3,
	},
	{
		name: "the great lighthouse",
		message: `o: ${Resource.wood}/${Resource.clay}/${Resource.stone}`,
		cost: [Resource.paper, Resource.paper, Resource.stone, Resource.wood],
		f: () => alert("extra brown resource"),
		points: 4,
	},
	{
		name: "piraeus",
		message: `o: ${Resource.paper}/${Resource.glass}`,
		cost: [Resource.clay, Resource.stone, Resource.wood, Resource.wood],
		f: () => alert("extra grey resource"),
		goAgain: true,
		points: 2,
	},
	{
		name: "the sanctuary",
		message: "$2 discount on gods, go again",
		cost: [Resource.paper, Resource.glass, Resource.stone, Resource.stone],
		// todo
		f: () => alert("2 discount on gods"),
		goAgain: true,
	},
	{
		name: "the mausoleum",
		message: "build from discard",
		cost: [
			Resource.paper,
			Resource.glass,
			Resource.glass,
			Resource.clay,
			Resource.clay,
		],
		// todo
		f: () => alert("build from discard"),
		points: 2,
	},
	{
		name: "the appian way",
		message: "steal $3, 3 points, go again",
		cost: [
			Resource.paper,
			Resource.clay,
			Resource.clay,
			Resource.stone,
			Resource.stone,
		],
		f: () => {
			utils.getMe().money += 3;
			stealMoney(3);
		},
		points: 3,
		goAgain: true,
	},
	{
		name: "the pyramids",
		message: "9 points",
		cost: [Resource.paper, Resource.stone, Resource.stone, Resource.stone],
		f: () => null,
		points: 9,
	},
	{
		name: "the sphinx",
		message: "6 points, go again",
		cost: [Resource.glass, Resource.glass, Resource.clay, Resource.stone],
		f: () => null,
		points: 6,
		goAgain: true,
	},
	{
		name: "the great library",
		message: "select 1/3 science tokens",
		cost: [Resource.paper, Resource.glass, Resource.wood, Resource.wood],
		// todo
		f: () => alert("choose a science token"),
		points: 4,
	},
	{
		name: "the colossus",
		message: "military +2, 3 points",
		cost: [Resource.glass, Resource.clay, Resource.clay, Resource.clay],
		f: () => increaseMilitary(2),
		points: 3,
	},
	{
		name: "the divine theater",
		message: "pick a god",
		cost: [
			Resource.paper,
			Resource.paper,
			Resource.glass,
			Resource.wood,
			Resource.wood,
		],
		// todo
		f: () => alert("pick a god"),
		points: 2,
	},
];

export default { cards, structure, wonders, sciences };
