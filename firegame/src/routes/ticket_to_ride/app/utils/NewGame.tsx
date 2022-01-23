import { LobbyType } from "../../../../shared/store";
import { Color, Tickets } from "./bank";
import utils, { store } from "./utils";

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];
  bank: Color[];
  deck?: Color[];
  discard?: Color[];
  ticketIndices: number[];
  tookTrain?: boolean;
  lastPlayer?: number;
};

export type Params = {
  lobby: LobbyType;
};

export type PlayerType = {
  userId: string;
  userName: string;
  color: Color;
  hand?: Color[];
  routeIndices?: { routeIndex: number; colorIndex: number }[];
  ticketIndices?: number[];
  takenTicketIndices?: number[];
  rainbowsDrawn: number;
};

function NewGame(params: Params): PromiseLike<GameType> {
  const deck = utils.shuffle(
    utils
      .enumArray(Color)
      .flatMap((c: Color) => utils.repeat(c, c === Color.rainbow ? 14 : 12))
  );
  const game: GameType = {
    params,
    currentPlayer: 0,
    players: [],
    deck,
    bank: deck.splice(0, utils.CARDS_IN_BANK),
    discard: [],
    ticketIndices: utils.shuffle(Tickets.map((t, i) => i)),
  };
  utils.maybeRedeal(game);
  return Promise.resolve(game).then(setPlayers);
}

function setPlayers(game: GameType): GameType {
  const colorIndices = utils.shuffle(
    utils
      .enumArray(Color)
      .filter((c) => c !== Color.rainbow && c !== Color.white)
  );
  game.players = utils
    .shuffle(Object.entries(store.lobby))
    .sort((a, b) => (b[0] === store.me.userId ? 1 : -1))
    .slice(0, 2)
    .map(([userId, userName], index) => ({
      userId,
      userName,
      color: colorIndices[index],
      takenTicketIndices: game.ticketIndices.splice(0, 3),
      rainbowsDrawn: 0,
    }));

  return game;
}

export default NewGame;
