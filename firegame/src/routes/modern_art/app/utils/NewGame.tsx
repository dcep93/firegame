import { LobbyType } from "../../../../shared/store";
import utils, { store } from "./utils";

export enum Artist {
  "Manuel Carvalho",
  "Sigrid Thaler",
  "Daniel Melim",
  "Ramon Martins",
  "Rafael Silveira",
}

export enum AType {
  double,
  open,
  hidden,
  fixed,
  single,
}

export type Art = {
  artist: Artist;
  aType: AType;
  src: string;
};

export type Auction = {
  art: Art[];
  bid: number;
  playerIndex: number;
  bidder: number;

  hiddenBids?: number[];
};

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];
  auction?: Auction;
  deck: Art[];
  values: { [a in Artist]: number[] };
  round: number;
};

export type Params = {
  lobby: LobbyType;
};

export type PlayerType = {
  userId: string;
  userName: string;
  money: number;
  hand?: Art[];
  collection: { [a in Artist]: number };
};

function NewGame(params: Params): PromiseLike<GameType> {
  const game: GameType = {
    params,
    currentPlayer: 0,
    players: [],
    deck: [],
    round: 1,
    values: utils
      .enumArray(Artist)
      .reduce((c, a) => ({ ...c, [a]: [0, 0, 0, 0] }), {}) as {
      [a in Artist]: number[];
    },
  };
  return Promise.resolve(game)
    .then(setPlayers)
    .then(populateDeck)
    .then((game) => utils.allDraw(game));
}

function setPlayers(game: GameType): GameType {
  game.players = utils
    .shuffle(Object.entries(store.lobby))
    .sort((a, b) => (b[0] === store.me.userId ? 1 : -1))
    .map(([userId, userName]) => ({
      userId,
      userName,
      hand: [],
      money: 100,
      collection: utils.emptyCollection(),
    }));
  if (game.players.length < 3 || game.players.length > 5)
    throw new Error("need between 3 and 5 players");
  return game;
}

function populateDeck(game: GameType): Promise<GameType> {
  const counts = {
    [Artist["Manuel Carvalho"]]: {
      [AType.double]: 2,
      [AType.fixed]: 2,
      [AType.hidden]: 2,
      [AType.single]: 3,
      [AType.open]: 3,
    },
    [Artist["Sigrid Thaler"]]: {
      [AType.double]: 2,
      [AType.fixed]: 3,
      [AType.hidden]: 3,
      [AType.single]: 2,
      [AType.open]: 3,
    },
    [Artist["Daniel Melim"]]: {
      [AType.double]: 3,
      [AType.fixed]: 3,
      [AType.hidden]: 3,
      [AType.single]: 3,
      [AType.open]: 3,
    },
    [Artist["Ramon Martins"]]: {
      [AType.double]: 3,
      [AType.fixed]: 3,
      [AType.hidden]: 3,
      [AType.single]: 3,
      [AType.open]: 3,
    },
    [Artist["Rafael Silveira"]]: {
      [AType.double]: 3,
      [AType.fixed]: 3,
      [AType.hidden]: 3,
      [AType.single]: 3,
      [AType.open]: 3,
    },
  } as { [a in Artist]: { [aType in AType]: number } };
  return Promise.all(
    utils.shuffle(
      utils
        .enumArray(Artist)
        .map((artist: Artist) =>
          utils
            .enumArray(AType)
            .map((aType: AType) =>
              utils.repeat({ artist, aType }, counts[artist][aType])
            )
            .flatMap((i) => i)
        )
        .flatMap((i) => i)
        .map(({ artist, aType }) => buildCard(artist, aType))
    )
  ).then((deck) => {
    game.deck = deck;
    return game;
  });
}

function buildCard(artist: Artist, aType: AType): Promise<Art> {
  return fetch("https://loremflickr.com/320/240/art").then((response) => ({
    artist,
    aType,
    src: response.url,
  }));
}

export default NewGame;
