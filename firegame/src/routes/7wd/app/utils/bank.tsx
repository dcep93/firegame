import { NUM_SCIENCES } from "../main/Science";

import utils, { store } from ".";
import {
	CardType,
	Age,
	Color,
	Resource,
	Upgrade,
	ScienceEnum,
	PlayerType,
	God,
	GodType,
	CommercialEnum,
	WonderType,
} from "./types";

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
				(utils.getMe().money += (utils.getMe().cards || []).filter(
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
					(utils.getMe().cards || []).filter(
						(cardIndex) => cards[cardIndex].color === Color.brown
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
				(utils.getMe().money += (utils.getMe().cards || []).filter(
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
					(utils.getMe().cards || []).filter(
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
				(player.cards || []).filter(
					(cardIndex) => cards[cardIndex].color === Color.yellow
				).length,
			f: () =>
				(utils.getMe().money += Math.max(
					store.gameW.game.players.map(
						(player) =>
							(player.cards || []).filter(
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
				(player.cards || []).filter(
					(cardIndex) =>
						cards[cardIndex].color === Color.brown ||
						cards[cardIndex].color === Color.grey
				).length,
			f: () =>
				(utils.getMe().money += Math.max(
					store.gameW.game.players.map(
						(player) =>
							(player.cards || []).filter(
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
				(player.cards || []).filter(
					(cardIndex) => cards[cardIndex].color === Color.red
				).length,
			f: () =>
				(utils.getMe().money += Math.max(
					store.gameW.game.players.map(
						(player) =>
							(player.cards || []).filter(
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
				(player.cards || []).filter(
					(cardIndex) => cards[cardIndex].color === Color.green
				).length,
			f: () =>
				(utils.getMe().money += Math.max(
					store.gameW.game.players.map(
						(player) =>
							(player.cards || []).filter(
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
				(player.cards || []).filter(
					(cardIndex) => cards[cardIndex].color === Color.blue
				).length,
			f: () =>
				(utils.getMe().money += Math.max(
					store.gameW.game.players.map(
						(player) =>
							(player.cards || []).filter(
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

const gods: GodType[] = [
	{
		name: "anubis",
		source: God.egyptian,
		message: "destroy a built wonder",
		f: () =>
			utils.addCommercial({
				commercial: CommercialEnum.anubis,
				playerIndex: utils.myIndex(),
			}),
	},
	{
		name: "ra",
		source: God.egyptian,
		message: "steal an unbuilt wonder",
		f: () =>
			utils.addCommercial({
				commercial: CommercialEnum.ra,
				playerIndex: utils.myIndex(),
			}),
	},
	{
		name: "isis",
		source: God.egyptian,
		message: "trash -> wonder",
		f: () =>
			utils.addCommercial({
				commercial: CommercialEnum.isis,
				playerIndex: utils.myIndex(),
			}),
	},
	{
		name: "aphrodite",
		source: God.greek,
		message: "9 points",
		f: () => null,
		points: () => 9,
	},
	{
		name: "zeus",
		source: God.greek,
		message: "destroy a structure card",
		f: () =>
			utils.addCommercial({
				commercial: CommercialEnum.zeus,
				playerIndex: utils.myIndex(),
			}),
	},
	{
		name: "hades",
		source: God.greek,
		message: "build a card from the trash",
		f: () =>
			utils.addCommercial({
				commercial: CommercialEnum.revive,
				playerIndex: utils.myIndex(),
			}),
	},
	{
		name: "enki",
		source: God.mesopotamian,
		message: "select 1 / 2 science tokens",
		f: () =>
			utils.addCommercial({
				commercial: CommercialEnum.enki,
				playerIndex: utils.myIndex(),
				sciences: utils
					.shuffle(
						store.gameW.game.sciences
							.slice(NUM_SCIENCES)
							.filter((obj) => !obj.taken)
					)
					.slice(0, 2)
					.map((obj) => obj.token),
			}),
	},
	{
		name: "nisaba",
		source: God.mesopotamian,
		message: "copy a science from opponent",
		f: () =>
			utils.addCommercial({
				commercial: CommercialEnum.nisaba,
				playerIndex: utils.myIndex(),
			}),
	},
	{
		name: "ishtar",
		source: God.mesopotamian,
		message: "gain law science token",
		f: () => utils.gainScience(ScienceEnum.law),
	},
	{
		name: "baal",
		source: God.phoenician,
		message: "steal a brown/grey card",
		f: () =>
			utils.addCommercial({
				commercial: CommercialEnum.baal,
				playerIndex: utils.myIndex(),
			}),
	},
	{
		name: "astarte",
		source: God.phoenician,
		message: "$7, 1 point per",
		f: (god: GodType) => (god.extra = 7),
		points: (god: GodType) => god.extra,
	},
	{
		name: "tanit",
		source: God.phoenician,
		message: "$12",
		f: () => (utils.getMe().money += 12),
	},
	{
		name: "neptune",
		source: God.roman,
		message: "destroy/trigger military tokens",
		f: () => {
			const myTokens = utils.getMe().militaryBonuses || {};
			const oppTokens = utils.getOpponent().militaryBonuses;
			utils.getMe().militaryBonuses = {};
			if (myTokens[6] || oppTokens[6])
				utils.getOpponent().money = Math.max(
					utils.getOpponent().money - 5,
					0
				);
			if (!myTokens[3]) {
				if (myTokens[6] && oppTokens[3]) {
					delete oppTokens[3];
				} else {
					utils.getOpponent().militaryBonuses = {};
				}
			}
		},
	},
	{
		name: "minerva",
		source: God.roman,
		message: "block military movement",
		f: () => (store.gameW.game.minerva = true),
	},
	{
		name: "mars",
		source: God.roman,
		message: "military 2",
		f: () => utils.increaseMilitary(2),
	},
	{
		name: "gate",
		message: "cost x2: select 1 from top gods",
		f: () =>
			utils.addCommercial({
				commercial: CommercialEnum.gate,
				playerIndex: utils.myIndex(),
			}),
	},
];

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
		f: () =>
			Promise.resolve()
				.then(() => utils.increaseMilitary(1))
				.then(() =>
					utils.addCommercial({
						commercial: CommercialEnum.destroyGrey,
						playerIndex: utils.myIndex(),
					})
				),
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
		f: () =>
			Promise.resolve()
				.then(() => utils.increaseMilitary(1))
				.then(() =>
					utils.addCommercial({
						commercial: CommercialEnum.destroyBrown,
						playerIndex: utils.myIndex(),
					})
				),
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
		f: () => null,
		goAgain: true,
		expansion: true,
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
		f: () =>
			utils.addCommercial({
				commercial: CommercialEnum.revive,
				playerIndex: utils.myIndex(),
			}),
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
			utils.stealMoney(3);
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
		f: () =>
			utils.addCommercial({
				commercial: CommercialEnum.library,
				playerIndex: utils.myIndex(),
				sciences: utils
					.shuffle(
						store.gameW.game.sciences
							.slice(NUM_SCIENCES)
							.filter((obj) => !obj.taken)
					)
					.slice(0, 3)
					.map((obj) => obj.token),
			}),
		points: 4,
	},
	{
		name: "the colossus",
		message: "military +2, 3 points",
		cost: [Resource.glass, Resource.clay, Resource.clay, Resource.clay],
		f: () => utils.increaseMilitary(2),
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
		f: () =>
			utils.addCommercial({
				commercial: CommercialEnum.theater,
				playerIndex: utils.myIndex(),
			}),
		points: 2,
		expansion: true,
	},
];

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

export default { cards, structure, wonders, gods };
