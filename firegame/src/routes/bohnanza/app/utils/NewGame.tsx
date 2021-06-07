import { LobbyType } from "../../../../shared/store";
import beans from "./beans";
import utils, { store } from "./utils";

export enum Phase {
  plant,
  plantSecond,
  discard,
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
      hand: [],
      fields: utils.count(3).map((i) => ({
        purchased: i !== 2,
        bean: -1,
        count: 0,
      })),
    }));
  switch (game.players.length) {
    case 2:
      game.deck = game.deck!.filter((b) => beans[b].name !== "Cocoa Bean");
      game.deck = game.deck!.filter((b) => beans[b].name !== "Garden Bean");
      game.players.forEach((p) => (p.hand = game.deck!.splice(0, 5)));
      break;
    case 3:
      game.deck = game.deck!.filter((b) => beans[b].name !== "Cocoa Bean");
      game.players.forEach((p) => (p.fields[2].purchased = true));
      game.players.forEach((p) => (p.hand = game.deck!.splice(0, 5)));
      break;
    case 4:
    case 5:
      game.deck = game.deck!.filter((b) => beans[b].name !== "Coffee Bean");
      game.players.forEach((p) => (p.hand = game.deck!.splice(0, 5)));
      break;
    default:
      game.deck = game.deck!.filter((b) => beans[b].name !== "Cocoa Bean");
      game.deck = game.deck!.filter((b) => beans[b].name !== "Garden Bean");
      game.players.forEach(
        (p, i) =>
          (p.hand = game.deck!.splice(
            0,
            i === 0 ? 3 : i === 1 ? 4 : i === 2 ? 5 : 6
          ))
      );
  }
  return game;
}

export default NewGame;
