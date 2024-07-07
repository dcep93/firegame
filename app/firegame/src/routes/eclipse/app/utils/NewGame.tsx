import { LobbyType } from "../../../../shared/store";
import { Action, Rank, Resources, Sector, Track } from "./gameTypes";
import { Diamond, Faction, Science, ShipData, Tile } from "./library";
import utils, { store } from "./utils";

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];

  year: number;
  action: { action: Action; state?: any };
  startingPlayer: number;
  sectors: Sector[];
  buyableSciences: Science[];
  sciencesBag: Science[];
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

  d?: {
    faction: Faction;
    ships: ShipData;
    storage: Resources;
    income: Resources;
    well: Resources;
    remainingDiscs: number;
    usedDiscs: number;
    research: { science: Science; track: Track }[];
    twoPointers: number;
    diamondUpgrades?: Diamond[];
    military?: number[];
  };
};

function NewGame(params: Params): PromiseLike<GameType> {
  return Promise.resolve(utils.newGame(params)).then(setPlayers);
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
    }));

  return game;
}

export default NewGame;
