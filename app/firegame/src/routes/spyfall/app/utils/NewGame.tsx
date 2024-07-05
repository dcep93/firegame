import { LobbyType } from "../../../../shared/store";
import utils, { store } from "./utils";

import locations_json from "../main/locations.json";

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];
  ps: string[];
  word: string;
  spy: string;
};

export type Params = {
  lobby: LobbyType;
  p: string;
};

export type PlayerType = {
  userId: string;
  userName: string;
};

function NewGame(params: Params): PromiseLike<GameType> {
  const ps =
    params.p.length > 0 ? params.p.split("\n") : Object.values(params.lobby);
  const game: GameType = {
    word: utils.randomFrom(locations_json),
    ps,
    spy: utils.randomFrom(ps),
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
