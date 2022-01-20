import { LobbyType } from "../../../../shared/store";
import { Color } from "./bank";
import utils, { store } from "./utils";

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];
  bank: Color[];
  deck?: Color[];
  discard?: Color[];
};

export type Params = {
  lobby: LobbyType;
};

export type PlayerType = {
  userId: string;
  userName: string;
  hand?: Color[];
  routeIndices?: number[];
};

function NewGame(params: Params): PromiseLike<GameType> {
  const deck = utils
    .enumArray(Color)
    .flatMap((c: Color) => utils.repeat(c, c === Color.grey ? 14 : 12));
  var bank;
  while (true) {
    bank = deck.splice(0, 5);
    if (bank.filter((c) => c === Color.grey).length < 3) break;
  }
  const game: GameType = {
    params,
    currentPlayer: 0,
    players: [],
    deck,
    bank,
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
