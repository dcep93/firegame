import React from "react";
import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";
import { Cities, City, Color, Routes, TicketType } from "./bank";
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
    if (utils.getMe().takenTicketIndices) return;
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
    if (utils.getMe().takenTicketIndices) return;
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
      utils.count(utils.CARDS_IN_BANK).forEach(() => utils.dealOneToBank(game));
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
    return this.ticketCompletedHelper(
      t.start,
      t.end,
      (player.routeIndices || []).map((i) => i.index),
      []
    );
  }

  ticketCompletedHelper(
    start: City,
    end: City,
    routeIndices: number[],
    seen: number[]
  ): boolean {
    for (let i = 0; i < routeIndices.length; i++) {
      const routeIndex = routeIndices[i];
      if (seen.includes(routeIndex)) continue;
      const route = Routes[routeIndex];
      var nextCity;
      if (route.end === start) {
        nextCity = route.start;
      } else if (route.start === start) {
        nextCity = route.end;
      } else {
        continue;
      }
      if (nextCity === end) return true;
      return this.ticketCompletedHelper(
        nextCity,
        end,
        routeIndices,
        seen.concat(routeIndex)
      );
    }
    return false;
  }

  longestPath(player: PlayerType): number {
    return this.longestPathHelper(
      null,
      (player.routeIndices || []).map((i) => i.index),
      [],
      0
    );
  }

  longestPathHelper(
    start: City | null,
    routeIndices: number[],
    seen: number[],
    seenLength: number
  ): number {
    const candidates: { end: City; index: number; length: number }[] = [];
    routeIndices.forEach((index) => {
      if (seen.includes(index)) return;
      const route = Routes[index];
      if (start === null || route.start === start)
        candidates.push({ end: route.end, index, length: route.length });
      if (start === null || route.end === start)
        candidates.push({ end: route.start, index, length: route.length });
    });
    return Math.max(
      seenLength,
      ...candidates.map((c) =>
        this.longestPathHelper(
          c.end,
          routeIndices,
          seen.concat(c.index),
          seenLength + c.length
        )
      )
    );
  }

  takeTickets() {
    if (!utils.isMyTurn()) return;
    if (utils.getMe().takenTicketIndices) return;
    if (store.gameW.game.tookTrain) return;
    utils.getMe().takenTicketIndices = store.gameW.game.ticketIndices.splice(
      0,
      3
    );
    store.update("took tickets");
  }

  getTicket(t: TicketType) {
    return (
      <div>
        <div>
          {Cities[t.start].name} → {Cities[t.end].name}
        </div>
        <div>{t.points}</div>
      </div>
    );
  }

  buyRoute(
    index: number,
    selected: { selected: { [n: number]: boolean } },
    update: (selected: { [n: number]: boolean }) => void
  ) {
    if (!utils.isMyTurn()) return;
    if (utils.getMe().takenTicketIndices) return;
    if (store.gameW.game.tookTrain) return;
    if (!utils.getMe().hand) return;
    const selectedIndices = Object.entries(selected)
      .filter(([key, val]) => val)
      .map(([key, val]) => +key);
    const colors = selectedIndices.map((i) => utils.getMe().hand![i]);
    if (colors.filter((c) => c === undefined).length > 0) return;
    const spentColors = Object.entries(
      Object.fromEntries(
        colors.filter((c) => c !== Color.rainbow).map((c) => [c, true])
      )
    );
    if (spentColors.length > 1) return;
    const route = Routes[index];
    if (selectedIndices.length !== route.length) return;
    utils.getMe().hand = utils
      .getMe()
      .hand!.filter((c, i) => !selectedIndices.includes(i));
    update({});
    if (!utils.getMe().routeIndices) utils.getMe().routeIndices = [];
    const colorIndex = route.colors.indexOf(+spentColors[0][0]) || 0;
    utils.getMe().routeIndices!.push({ index, colorIndex });
    store.update(
      `bought ${Cities[route.start].name} → ${
        Cities[route.end].name
      } for ${colors.map((c) => Color[c]).join(",")}`
    );
  }
}

const utils = new Utils();

export default utils;

export { store };
