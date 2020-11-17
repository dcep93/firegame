import { LobbyType } from "../../../../shared/store";
import bank from "./bank";
import { BonusType, CardType, ExpansionEnum, FoodEnum } from "./types";
import utils, { store } from "./utils";

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];
  deck: number[];
  bonuses: number[];
  startingPlayer: number;
  remainingRounds: number;
};

export type Params = {
  lobby: LobbyType;
  europeanExpansion: boolean;
};

export type PlayerType = {
  userId: string;
  userName: string;
  hand?: number[];
  bonuses: number[];
  food?: { [f in FoodEnum]?: number };
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
  game.bonuses = utils.shuffle(
    bank.bonuses
      .map((_, i) => i)
      .filter((index) => playWithBonus(bank.bonuses[index], params))
  );
  return Promise.resolve(game).then(setPlayers);
}

function playWithCard(card: CardType, params: Params): boolean {
  if (card.food_star) return false; // todo
  switch (card.expansion) {
    case ExpansionEnum.core:
      return true;
    case ExpansionEnum.chinesepromo:
      return false; // todo
    case ExpansionEnum.european:
      return params.europeanExpansion;
    case ExpansionEnum.swiftstart:
      return true;
  }
}

function playWithBonus(bonus: BonusType, params: Params): boolean {
  if (bonus.automa_only) return false;
  if (bonus.to_skip) return false;
  return true;
}

function setPlayers(game: GameType): GameType {
  game.players = Object.entries(store.lobby)
    .sort((a, b) => (b[0] === store.me.userId ? 1 : -1))
    .map(([userId, userName]) => ({
      userId,
      userName,
      hand: game.deck.splice(0, 5),
      bonuses: game.bonuses.splice(0, 2),
    }));
  game.currentPlayer = game.startingPlayer = utils.myIndex(game);
  return game;
}

export default NewGame;
