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

export const Routes: {
  start: City;
  end: City;
  length: number;
  colors: Color[];
}[] = [
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
  {
    start: City.phoenix,
    end: City.denver,
    length: 5,
    colors: [Color.white],
  },
  {
    start: City.denver,
    end: City.helena,
    length: 4,
    colors: [Color.green],
  },
  {
    start: City.helena,
    end: City.calgary,
    length: 4,
    colors: [Color.blue],
  },
  {
    start: City.winnipeg,
    end: City.duluth,
    length: 4,
    colors: [Color.black],
  },
  {
    start: City.winnipeg,
    end: City.sault_st_marie,
    length: 6,
    colors: [Color.grey],
  },
  {
    start: City.duluth,
    end: City.toronto,
    length: 6,
    colors: [Color.pink],
  },
  {
    start: City.sault_st_marie,
    end: City.montreal,
    length: 5,
    colors: [Color.black],
  },
  {
    start: City.montreal,
    end: City.new_york,
    length: 3,
    colors: [Color.blue],
  },
  {
    start: City.saint_louis,
    end: City.pittsburgh,
    length: 5,
    colors: [Color.green],
  },
  {
    start: City.denver,
    end: City.omaha,
    length: 4,
    colors: [Color.pink],
  },
  {
    start: City.helena,
    end: City.omaha,
    length: 5,
    colors: [Color.red],
  },
  {
    start: City.helena,
    end: City.duluth,
    length: 6,
    colors: [Color.orange],
  },
  {
    start: City.el_paso,
    end: City.oklahoma_city,
    length: 5,
    colors: [Color.yellow],
  },
  {
    start: City.el_paso,
    end: City.houston,
    length: 6,
    colors: [Color.green],
  },
  {
    start: City.houston,
    end: City.new_orleans,
    length: 2,
    colors: [Color.grey],
  },
  {
    start: City.houston,
    end: City.miami,
    length: 6,
    colors: [Color.red],
  },
  {
    start: City.miami,
    end: City.atlanta,
    length: 5,
    colors: [Color.blue],
  },
  {
    start: City.miami,
    end: City.charleston,
    length: 4,
    colors: [Color.pink],
  },
  {
    start: City.atlanta,
    end: City.charleston,
    length: 2,
    colors: [Color.grey],
  },
  {
    start: City.el_paso,
    end: City.dallas,
    length: 4,
    colors: [Color.red],
  },
  {
    start: City.little_rock,
    end: City.nashville,
    length: 3,
    colors: [Color.white],
  },
];

export const Cities: {
  [c in City]: { name: string; latitude: number; longitude: number };
} = {
  [City.vancouver]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.seattle]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.portland]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.san_francisco]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.los_angeles]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.calgary]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.helena]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.salt_lake_city]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.las_vegas]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.phoenix]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.el_paso]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.santa_fe]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.denver]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.winnipeg]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.duluth]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.omaha]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.kansas_city]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.oklahoma_city]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.dallas]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.houston]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.new_orleans]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.little_rock]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.saint_louis]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.chicago]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.toronto]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.sault_st_marie]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.pittsburgh]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.nashville]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.raleigh]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.atlanta]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.charleston]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.miami]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.washington]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.new_york]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.boston]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
  [City.montreal]: {
    name: "Vancouver",
    latitude: 0,
    longitude: 0,
  },
};

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
