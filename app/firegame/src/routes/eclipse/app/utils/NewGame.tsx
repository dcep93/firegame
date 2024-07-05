import { LobbyType } from "../../../../shared/store";
import {
  DiamondEnum,
  FactionEnum,
  MaterialsType,
  Rank,
  Research,
  ResearchEnum,
  TileType,
  Tiles,
  Track,
} from "./library";
import utils, { store } from "./utils";

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];
  map: TileType[];
  buyableResearch: ResearchEnum[];
  researchBag: ResearchEnum[];
  diamonds: DiamondEnum[];
  military: number[];
  tiles: { [rank: string]: string[] | undefined };
};

export type Params = {
  lobby: LobbyType;
};

export type PlayerType = {
  userId: string;
  userName: string;

  d:
    | undefined
    | {
        faction: FactionEnum;
        storage: MaterialsType;
        income: MaterialsType;
        well: MaterialsType;
        discs: number;
        usedDiscs: number;
        research: ResearchEnum[];
        twoPointers: number;
        diamondUpgrades: DiamondEnum[] | undefined;
        military: number[] | undefined;
      };
};

function NewGame(params: Params): PromiseLike<GameType> {
  const game: GameType = {
    params,
    currentPlayer: 0,
    players: [],
    map: [],
    buyableResearch: [],
    researchBag: utils.shuffle(
      utils
        .enumArray(ResearchEnum)
        .flatMap((researchEnum) => utils.repeat(researchEnum, 4))
    ),
    diamonds: utils.shuffle(
      utils
        .enumArray(DiamondEnum)
        .flatMap((diamondEnum) => utils.repeat(diamondEnum, 4))
    ),
    military: utils.shuffle(
      [1, 2, 3, 4].flatMap((value) => utils.repeat(value, 4))
    ),
    tiles: Object.fromEntries(
      utils.enumArray(Rank).map((rank) => [rank, Object.keys(Tiles)])
    ),
    // tiles: { [rank: string]: TileType[] | undefined };
  };
  while (true) {
    const needed =
      14 -
      game.buyableResearch.filter(
        (research) => Research[research].track !== Track.black
      ).length;
    if (needed === 0) {
      break;
    }
    utils.drawResearch(needed, game);
  }
  return Promise.resolve(game).then(setPlayers);
}

function setPlayers(game: GameType): GameType {
  game.players = utils
    .shuffle(Object.entries(store.lobby))
    .sort((a, b) => (b[0] === store.me.userId ? 1 : -1))
    .slice(0, 2)
    .map(([userId, userName]) => ({
      userId,
      userName,
      d: undefined,
    }));

  return game;
}

export default NewGame;
