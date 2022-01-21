import React from "react";
import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";
import { Color, TicketType } from "./bank";
import { GameType, PlayerType } from "./NewGame";

const store: StoreType<GameType> = store_;

class Utils extends Shared<GameType, PlayerType> {
  CARDS_IN_BANK = 5;

  incrementPlayerTurn(game_?: GameType | undefined): void {
    if (store.gameW.game.currentPlayer === store.gameW.game.lastPlayer)
      store.gameW.game.lastPlayer = -1;
    super.incrementPlayerTurn(game_);
  }

  linkPoints(length: number): number {
    return [1, 2, 4, 7, 10, 15][length - 1];
  }

  renderCard(color: Color, index: number, onClick: (index: number) => void) {
    const backgroundColor = {
      [Color.black]: "grey",
      [Color.blue]: "lightblue",
      [Color.green]: "lightgreen",
      [Color.rainbow]: "white",
      [Color.orange]: "orange",
      [Color.pink]: "pink",
      [Color.red]: "red",
      [Color.white]: "white",
      [Color.yellow]: "yellow",
    }[color];
    return (
      <div
        key={index}
        onClick={() => onClick(index)}
        className={[styles.bubble, color === Color.rainbow && css.rainbow].join(
          " "
        )}
        style={{ backgroundColor }}
      >
        {Color[color]}
      </div>
    );
  }

  takeFromBank(index: number) {
    if (!utils.isMyTurn()) return;
    if (store.gameW.game.tookTrain) {
      if (store.gameW.game.bank[index] === Color.rainbow) return;
      delete store.gameW.game.tookTrain;
      utils.incrementPlayerTurn();
    } else {
      if (store.gameW.game.bank[index] === Color.rainbow) {
        utils.incrementPlayerTurn();
      } else {
        store.gameW.game.tookTrain = true;
      }
    }
    const me = utils.getMe();
    if (!me.hand) me.hand = [];
    const c = store.gameW.game.bank.splice(index, 1)[0];
    me.hand.unshift(c);
    me.hand.sort();
    utils.dealOneToBank(store.gameW.game);
    utils.maybeRedeal(store.gameW.game);
    store.update(`took ${Color[c]} from bank`);
  }

  takeFromDeck() {
    if (!utils.isMyTurn()) return;
    if (!store.gameW.game.deck) {
      if (!store.gameW.game.discard) return;
      store.gameW.game.deck = utils.shuffle(
        store.gameW.game.discard!.splice(0)
      );
    }
    if (store.gameW.game.tookTrain) {
      delete store.gameW.game.tookTrain;
      utils.incrementPlayerTurn();
    } else {
      store.gameW.game.tookTrain = true;
    }
    const me = utils.getMe();
    if (!me.hand) me.hand = [];
    const c = store.gameW.game.deck!.shift()!;
    me.hand.unshift(c);
    me.hand.sort();
    store.update(`took from deck`);
  }

  maybeRedeal(game: GameType) {
    for (let i = 0; i < 100; i++) {
      if (game.bank.filter((c) => c === Color.rainbow).length < 3) return;
      if (!game.discard) game.discard = [];
      game.discard.push(...game.bank.splice(0));
      for (let j = 0; j < utils.CARDS_IN_BANK; j++) {
        utils.dealOneToBank(game);
      }
    }
    alert("uh oh maybeRedeal");
  }

  dealOneToBank(game: GameType) {
    if ((game.deck || []).length === 0)
      game.deck = utils.shuffle(game.discard!.splice(0));
    // no cards left in deck, cant deal!
    if (game.deck!.length === 0) return;
    game.bank.push(game.deck!.shift()!);
  }

  ticketCompleted(t: TicketType, player: PlayerType): boolean {
    return false;
  }

  longestPath(player: PlayerType): number {
    return -1;
  }
}

const utils = new Utils();

export default utils;

export { store };
