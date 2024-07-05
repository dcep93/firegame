import { LobbyType } from "../../../../shared/store";
import { Action, Rank, Resources, Sector, Track } from "./gameTypes";
import {
  Diamond,
  Diamonds,
  Faction,
  Science,
  Sciences,
  Tile,
  Tiles,
} from "./library";
import utils, { store } from "./utils";

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];

  year: number;
  action: Action;
  startingPlayer: number;
  map: Sector[];
  buyableResearch: Science[];
  researchBag: Science[];
  diamonds: Diamond[];
  military: number[];
  tiles: { [rank in Rank]?: Tile[] };
};

export type Params = {
  lobby: LobbyType;
  randomStarting: boolean;
};

export type PlayerType = {
  userId: string;
  userName: string;

  d:
    | undefined
    | {
        faction: Faction;
        storage: Resources;
        income: Resources;
        well: Resources;
        discs: number;
        usedDiscs: number;
        research: Science[];
        twoPointers: number;
        diamondUpgrades?: Diamond[];
        military?: number[];
      };
};

function NewGame(params: Params): PromiseLike<GameType> {
  const game: GameType = {
    params,
    currentPlayer: 0,

    year: 1,
    action: Action.selectFaction,
    startingPlayer: 0,
    players: [],
    map: [],
    buyableResearch: [],
    researchBag: utils.shuffle(
      Object.entries(Sciences).flatMap(([key, value]) =>
        utils.repeat(key as Science, 4)
      )
    ),
    diamonds: utils.shuffle(
      Object.entries(Diamonds).flatMap(([key, value]) =>
        utils.repeat(key as Diamond, 4)
      )
    ),
    military: utils.shuffle(
      [1, 2, 3, 4].flatMap((value) => utils.repeat(value, 4))
    ),
    tiles: Object.fromEntries(
      utils
        .enumArray(Rank)
        .map((rank) => [
          rank,
          Object.keys(Tiles).filter((t) => Tiles[t].rank === rank),
        ])
    ),
  };
  game.map.push({
    tile: game.tiles[Rank.o]!.pop() as Tile,
    orientation: 0,
    enemies: ["death_star"],
    tokens: [],
  });
  for (
    var needed;
    (needed =
      14 -
      game.buyableResearch.filter(
        (science) => Sciences[science].track !== Track.black
      ).length);
    utils.drawResearch(needed, game)
  ) {}
  return Promise.resolve(game).then(setPlayers);
}

function setPlayers(game: GameType): GameType {
  game.players = utils
    .shuffle(Object.entries(store.lobby))
    .sort((a, b) =>
      game.params.randomStarting || b[0] === store.me.userId ? 1 : -1
    )
    .slice(0, 2)
    .map(([userId, userName]) => ({
      userId,
      userName,
      d: undefined,
    }));
  game.currentPlayer = game.players.length - 1;

  return game;
}

export default NewGame;
