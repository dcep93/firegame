import { LobbyType } from "../../../../shared/store";
import { Action } from "./Action";
import { CavernTile, FarmTile } from "./Tile";
import utils, { store } from "./utils";

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];

  startingPlayer: number;
  year: number;
  actionBonuses: { [a: number]: ResourcesType } | undefined;
  actions: Action[];
  upcomingActions: Action[] | undefined;
  remainingHarvests: boolean[] | undefined;

  takenActions:
    | {
        [index: number]: { playerIndex: number; weaponLevel: number };
      }
    | undefined;
};

export type Params = {
  lobby: LobbyType;
};

export type PlayerType = {
  userId: string;
  userName: string;

  // -1: baby, 0: no weapon, 1+: weapon level
  usedDwarves: number[] | undefined;
  availableDwarves: number[] | undefined;

  resources: ResourcesType | undefined;

  begging: number;

  farm: FarmTile[][];
  cavern: CavernTile[][];
};

export type ResourcesType = {
  food: number;
  stone: number;
  wood: number;
  ore: number;
  rubies: number;
  gold: number;
};

function NewGame(params: Params): PromiseLike<GameType> {
  const game: GameType = {
    params,
    currentPlayer: 0,
    players: [],

    startingPlayer: 0,
    year: 1,
    actionBonuses: undefined,
    actions: [],
    upcomingActions: undefined,
    remainingHarvests: undefined,
    takenActions: undefined,
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

      usedDwarves: undefined,
      availableDwarves: undefined,

      resources: undefined,

      begging: 0,

      farm: [],
      cavern: [],
    }));

  return game;
}

export default NewGame;
