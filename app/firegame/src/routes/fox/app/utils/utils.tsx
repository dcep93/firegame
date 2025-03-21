import SharedUtils from "../../../../shared/shared";
import store, { StoreType } from "../../../../shared/store";

import NewGame, { Card, GameType, Params, PlayerType } from "./NewGame";

const store_: StoreType<GameType> = store;
class Utils extends SharedUtils<GameType, PlayerType> {
  newGame(params: Params) {
    return NewGame(params);
  }
}
const utils = new Utils();
const NUM_RANKS = 11;
const NUM_SUITS = 3;
const TRICKS_PER_ROUND = 13;

function deal(game: GameType): GameType {
  game.currentPlayer = game.dealer;
  game.dealer = utils.playerIndexByIndex(game.dealer + 1, game);
  game.lead = null;
  game.deck = buildDeck();
  game.players = dealPlayers(game);
  game.trump = game.deck.shift()!;
  return game;
}

function buildDeck(): Card[] {
  const deck = [];
  for (let i = 0; i < NUM_SUITS; i++) {
    let suit = String.fromCharCode(65 + i);
    for (let value = 1; value <= NUM_RANKS; value++) {
      deck.push({ suit, value });
    }
  }
  utils.shuffle(deck);
  return deck;
}

function dealPlayers(game: GameType): PlayerType[] {
  return game.players.map((player) =>
    Object.assign(player, { hand: dealHand(game), tricks: 0 })
  );
}

function dealHand(game: GameType): Card[] {
  const hand = [];
  for (let i = 0; i < TRICKS_PER_ROUND; i++) {
    hand.push(game.deck.shift()!);
  }
  sortHand(hand);
  return hand;
}

function sortHand(hand: Card[]): void {
  hand.sort((a, b) => getSortPosition(a) - getSortPosition(b));
}

function getSortPosition(card: Card) {
  return card.suit.codePointAt(0)! * NUM_RANKS + card.value;
}

function getText(card: Card) {
  return `${card.suit}/${card.value || "-"}`;
}

export { deal, getText, utils as shared, sortHand, store_ as store };
