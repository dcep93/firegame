import { LobbyType } from "../../../../shared/store";
import { deck, Resource } from "./bank";
import utils, { store } from "./utils";

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];

  deckIndices: number[] | undefined;
  outOfPlayZones: number[] | undefined; // todo
  resources: { [r in Resource]: number };
};

export type Params = {
  lobby: LobbyType;
};

export type PlayerType = {
  userId: string;
  userName: string;

  color: string;
  money: number;
  powerPlantIndices: number[] | undefined;
  cityIndices: number[] | undefined;
  resources: { [r in Resource]: number };
};

function NewGame(params: Params): PromiseLike<GameType> {
  const game: GameType = {
    params,
    currentPlayer: 0,
    players: [],
    deckIndices: undefined,
    outOfPlayZones: [],
    resources: {
      [Resource.coal]: 24,
      [Resource.oil]: 18,
      [Resource.garbage]: 9,
      [Resource.uranium]: 2,
    },
  };
  return Promise.resolve(game).then(setPlayers).then(deal);
}

function deal(game: GameType): GameType {
  const grouped = utils.groupByF(deck, (pp) => pp.isPlug.toString());
  const plugs = utils.shuffle(grouped["true"]);
  const sockets = utils.shuffle(grouped["false"]);
  plugs.splice(0, { 2: 1, 3: 2, 4: 1 }[game.players.length] || 0);
  sockets.splice(0, { 2: 5, 3: 6, 4: 3 }[game.players.length] || 0);
  game.deckIndices = plugs
    .splice(0, 9)
    .concat(utils.shuffle(plugs.concat(sockets)))
    .map(({ index }) => index);
  return game;
}

function setPlayers(game: GameType): GameType {
  game.players = utils
    .shuffle(Object.entries(store.lobby))
    .slice(0, 2)
    .map(([userId, userName], index) => ({
      userId,
      userName,
      color: ["red", "blue", "green", "pink", "yellow", "orange"][index],
      money: 50,
      powerPlantIndices: [],
      cityIndices: [],
      resources: Object.fromEntries(
        utils.enumArray(Resource).map((r) => [r, 0])
      ) as { [r in Resource]: number },
    }));

  return game;
}

export default NewGame;
