import { LobbyType } from "../../../../shared/store";
import utils, { store } from "./utils";

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];
};

export type Params = {
  lobby: LobbyType;
};

export type PlayerType = {
  userId: string;
  userName: string;
};

export enum City {
  vancouver,
  seattle,
  portland,
  san_francisco,
  los_angeles,
  calgary,
  helena,
  salt_lake_city,
  las_vegas,
  phoenix,
  el_paso,
  santa_fe,
  denver,
  winnipeg,
  duluth,
  omaha,
  kansas_city,
  oklahoma_city,
  dallas,
  houston,
  new_orleans,
  little_rock,
  saint_louis,
  chicago,
  toronto,
  sault_st_marie,
  pittsburgh,
  nashville,
  raleigh,
  atlanta,
  charleston,
  miami,
  washington,
  new_york,
  boston,
  montreal,
}

export enum Color {
  grey,
  yellow,
  blue,
  green,
  pink,
  white,
  black,
  orange,
  red,
}

export type TicketType = { start: City; end: City; points: number };

export const Routes = [
  {
    start: City.vancouver,
    end: City.seattle,
    length: 1,
    colors: [Color.grey, Color.grey],
  },
  {
    start: City.seattle,
    end: City.portland,
    length: 1,
    colors: [Color.grey, Color.grey],
  },
  {
    start: City.portland,
    end: City.san_francisco,
    length: 5,
    colors: [Color.pink, Color.green],
  },
  {
    start: City.san_francisco,
    end: City.los_angeles,
    length: 3,
    colors: [Color.yellow, Color.pink],
  },
  {
    start: City.los_angeles,
    end: City.el_paso,
    length: 6,
    colors: [Color.black],
  },
  {
    start: City.vancouver,
    end: City.calgary,
    length: 3,
    colors: [Color.grey],
  },
  {
    start: City.calgary,
    end: City.seattle,
    length: 4,
    colors: [Color.grey],
  },
  {
    start: City.helena,
    end: City.seattle,
    length: 6,
    colors: [Color.yellow],
  },
  {
    start: City.calgary,
    end: City.helena,
    length: 4,
    colors: [Color.grey],
  },
  {
    start: City.helena,
    end: City.salt_lake_city,
    length: 3,
    colors: [Color.pink],
  },
  {
    start: City.portland,
    end: City.salt_lake_city,
    length: 6,
    colors: [Color.blue],
  },
  {
    start: City.san_francisco,
    end: City.salt_lake_city,
    length: 5,
    colors: [Color.orange, Color.white],
  },
  {
    start: City.salt_lake_city,
    end: City.las_vegas,
    length: 3,
    colors: [Color.orange],
  },
  {
    start: City.las_vegas,
    end: City.los_angeles,
    length: 2,
    colors: [Color.grey],
  },
  {
    start: City.los_angeles,
    end: City.phoenix,
    length: 3,
    colors: [Color.grey],
  },
];

function NewGame(params: Params): PromiseLike<GameType> {
  const game: GameType = {
    params,
    currentPlayer: 0,
    players: [],
  };
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
    }));

  return game;
}

export default NewGame;
