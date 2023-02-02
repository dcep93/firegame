import { LobbyType } from "../../../../shared/store";
import utils, { store } from "./utils";

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];
  policies: boolean[];
  discard?: boolean[];
  previousCabinet: number[];
};

export type Params = {
  lobby: LobbyType;
};

export type PlayerType = {
  userId: string;
  userName: string;
  isLiberal: boolean | null; // true for liberal, false for fascist, null for hitler
};

function NewGame(params: Params): PromiseLike<GameType> {
  const game: GameType = {
    params,
    currentPlayer: 0,
    players: [],
    policies: utils.getNewPolicies(),
    previousCabinet: [-1],
  };
  return Promise.resolve(game).then(setPlayers);
}

function setPlayers(game: GameType): GameType {
  const numPlayers = Object.entries(store.lobby).length;
  const numFascists = Math.floor((numPlayers - 3) / 2);
  const affiliations = utils.shuffle(
    ([null] as (boolean | null)[])
      .concat(utils.repeat(false, numFascists))
      .concat(utils.repeat(true, numPlayers - numFascists - 1))
  );
  game.players = utils
    .shuffle(Object.entries(store.lobby))
    .sort((a, b) => (b[0] === store.me.userId ? 1 : -1))
    .slice(0, 2)
    .map(([userId, userName], i) => ({
      userId,
      userName,
      isLiberal: affiliations[i],
    }));

  return game;
}

export default NewGame;
