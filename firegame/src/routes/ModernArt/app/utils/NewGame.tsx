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
  name: string;
  src: string;
};

export type Auction = {
  art: Art;
  bid: number;
  playerIndex: number;
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
  hand: Art[];
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
  game.players = Object.entries(store.lobby)
    .sort((a, b) => (b[0] === store.me.userId ? 1 : -1))
    .map(([userId, userName]) => ({
      userId,
      userName,
      hand: [],
      money: 100,
      collection: utils
        .enumArray(Artist)
        .reduce((c, a) => ({ ...c, [a]: 0 }), {}) as { [a in Artist]: number },
    }));
  if (game.players.length < 3 || game.players.length > 5)
    throw new Error("need between 3 and 5 players");
  return game;
}

// todo
function populateDeck(game: GameType): GameType {
  game.deck = utils.repeat(
    {
      artist: Artist["Daniel Melim"],
      name: "lmao",
      src: "https://www.vangoghgallery.com/img/starry_night_full.jpg",
      aType: AType.fixed,
    },
    100
  );
  return game;
}

export default NewGame;
