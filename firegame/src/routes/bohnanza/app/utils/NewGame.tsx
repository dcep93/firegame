import { LobbyType } from "../../../../shared/store";
import beans from "./beans";
import utils, { store } from "./utils";

export enum Phase {
  plant,
  plantSecond,
  draw,
}

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];
  deck?: number[];
  discard?: number[];
  phase: Phase;
  table?: { origin: number; bean: number }[];
  shuffles: number;
};

export type Params = {
  lobby: LobbyType;
};

export type Field = {
  purchased: boolean;
  bean: number;
  count: number;
};

export type PlayerType = {
  userId: string;
  userName: string;
  hand?: number[];
  money?: number[];
  fields: Field[];
};

function NewGame(params: Params): PromiseLike<GameType> {
  const game: GameType = {
    params,
    currentPlayer: 0,
    players: [],
    deck: utils.shuffle(beans.flatMap((b, i) => utils.repeat(i, b.quantity))),
    phase: Phase.plant,
    shuffles: 0,
  };
  return Promise.resolve(game).then(setPlayers);
}

function setPlayers(game: GameType): GameType {
  game.players = utils
    .shuffle(Object.entries(store.lobby))
    .sort((a, b) => (b[0] === store.me.userId ? 1 : -1))
    .map(([userId, userName]) => ({
      userId,
      userName,
      hand: game.deck!.splice(0, 5),
      fields: utils.count(3).map((i) => ({
        purchased: i !== 2,
        bean: -1,
        count: 0,
      })),
    }));
  return game;
}

export default NewGame;
