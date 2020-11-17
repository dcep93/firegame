import { LobbyType } from "../../../../shared/store";
import bank from "./bank";
import types, { CardType } from "./types";
import utils, { store } from "./utils";

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];
  deck: number[];
};

export type Params = {
  lobby: LobbyType;
  europeanExpansion: boolean;
};

export type PlayerType = {
  userId: string;
  userName: string;
};

function NewGame(params: Params): PromiseLike<GameType> {
  // @ts-ignore game being constructed
  const game: GameType = {};
  game.params = params;
  game.deck = utils.shuffle(
    bank.cards
      .map((_, i) => i)
      .filter((index) => playWithCard(bank.cards[index], params))
  );
  return Promise.resolve(game).then(setPlayers);
}

function playWithCard(card: CardType, params: Params): boolean {
  if (card.food_star) return false; // todo
  switch (card.expansion) {
    case types.expansion.core:
      return true;
    case types.expansion.chinesepromo:
      return false; // todo
    case types.expansion.european:
      return params.europeanExpansion;
    case types.expansion.swiftstart:
      return true;
  }
}

function setPlayers(game: GameType): GameType {
  game.players = Object.entries(store.lobby)
    .sort((a, b) => (b[0] === store.me.userId ? 1 : -1))
    .map(([userId, userName]) => ({
      userId,
      userName,
    }));
  game.currentPlayer = utils.myIndex(game);
  return game;
}

export default NewGame;
