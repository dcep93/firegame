import React from "react";
import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";
import { Cities, City, Color, Routes, TicketType } from "./bank";
import { GameType, PlayerType } from "./NewGame";

const store: StoreType<GameType> = store_;

class Utils extends Shared<GameType, PlayerType> {
  NUM_TRAINS = 45;
  CARDS_IN_BANK = 5;

  incrementPlayerTurn(game_?: GameType | undefined): void {
    if (store.gameW.game.currentPlayer === store.gameW.game.lastPlayer) {
      store.gameW.info.alert = "the game is over";
      store.gameW.game.lastPlayer = -1;
    }
    super.incrementPlayerTurn(game_);
  }

  linkPoints(length: number): number {
    return [1, 2, 4, 7, 10, 15][length - 1];
  }

  backgroundColor(color: Color) {
    return {
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
  }

  renderCard(color: Color, index: number, onClick: (index: number) => void) {
    const backgroundColor = this.backgroundColor(color);
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
    if (!utils.isMyTurn()) return alert("not your turn");
    if (utils.getMe().takenTicketIndices)
      return alert("need to select tickets");
    if (store.gameW.game.tookTrain) {
      if (store.gameW.game.bank[index] === Color.rainbow)
        return alert("already took card");
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
    me.lastTaken = c;
    var msg = `took ${Color[c]} from bank`;
    me.hand.unshift(c);
    me.hand.sort();
    utils.dealOneToBank(store.gameW.game);
    const shuffled = utils.maybeRedeal(store.gameW.game);
    if (shuffled) msg += ` - ${shuffled}`;
    store.update(msg);
  }

  takeFromDeck() {
    if (!utils.isMyTurn()) return alert("not your turn");
    if (utils.getMe().takenTicketIndices)
      return alert("need to select tickets");
    if (!store.gameW.game.deck) {
      if (!store.gameW.game.discard) return alert("no cards left");
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
    if (c === Color.rainbow) me.rainbowsDrawn++;
    me.cardsDrawn++;
    me.lastTaken = c;
    me.hand.unshift(c);
    me.hand.sort();
    store.update(`took from deck`);
  }

  maybeRedeal(game: GameType): number {
    for (let i = 0; i < 100; i++) {
      if (game.bank.filter((c) => c === Color.rainbow).length < 3) return i;
      if (!game.discard) game.discard = [];
      game.discard.push(...game.bank.splice(0));
      utils.count(utils.CARDS_IN_BANK).forEach(() => utils.dealOneToBank(game));
    }
    alert("uh oh maybeRedeal");
    return -1;
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
      (player.routeIndices || []).map((i) => i.routeIndex),
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
      if (
        this.ticketCompletedHelper(
          nextCity,
          end,
          routeIndices,
          seen.concat(routeIndex)
        )
      )
        return true;
    }
    return false;
  }

  longestPath(player: PlayerType): number {
    return this.longestPathHelper(
      null,
      (player.routeIndices || []).map((i) => i.routeIndex),
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
    if (!utils.isMyTurn()) return alert("not your turn");
    if (utils.getMe().takenTicketIndices)
      return alert("need to select tickets");
    if (store.gameW.game.tookTrain) return alert("already took card");
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
    routeIndex: number,
    colorIndex: number,
    selected: { [n: number]: boolean },
    update: (selected: { [n: number]: boolean }) => void
  ) {
    if (!utils.isMyTurn()) return alert("not your turn");
    if (utils.getMe().takenTicketIndices)
      return alert("need to select tickets");
    if (store.gameW.game.tookTrain) return alert("already took card");

    if (
      store.gameW.game.players.find((p) =>
        (p.routeIndices || []).find(
          (r) => r.routeIndex === routeIndex && r.colorIndex === colorIndex
        )
      )
    )
      return alert("route already purchased");
    if (
      store.gameW.game.players.find((p) =>
        (p.routeIndices || []).find((r) => r.routeIndex === routeIndex)
      )
    )
      return alert("cannot buy parallel route in 2-3 player game");
    const route = Routes[routeIndex];
    const selectedIndices = Object.entries(selected)
      .filter(([key, val]) => val)
      .map(([key, val]) => +key);
    if (selectedIndices.length === 0)
      selectedIndices.push(
        ...(utils.getMe().hand || [])
          .map((c, i) => ({ c, i }))
          .filter(
            (obj) =>
              obj.c === route.colors[colorIndex] || obj.c === Color.rainbow
          )
          .sort((a, b) => (a.c === Color.rainbow ? 1 : -1))
          .map((obj) => obj.i)
          .slice(0, route.length)
      );
    const colors = selectedIndices.map((i) => utils.getMe().hand![i]);
    const spentColors = Object.entries(
      Object.fromEntries(
        colors.filter((c) => c !== Color.rainbow).map((c) => [c, true])
      )
    ).map(([c, v]) => +c);
    if (spentColors.length > 1)
      return alert("can only spend one color per route");
    if (
      spentColors.length > 0 &&
      route.colors[colorIndex] !== Color.rainbow &&
      route.colors[colorIndex] !== spentColors[0]!
    )
      return alert("wrong color");
    if (selectedIndices.length !== route.length)
      return alert("wrong payment number");
    if (route.length > utils.trainsLeft(utils.getMe()))
      return alert("not enough trains");
    utils.getMe().hand = utils
      .getMe()
      .hand!.filter((c, i) => !selectedIndices.includes(i));
    if (!store.gameW.game.discard) store.gameW.game.discard = [];
    // store.gameW.game.discard.push(...spentColors);
    update({});
    if (!utils.getMe().routeIndices) utils.getMe().routeIndices = [];
    utils.getMe().routeIndices!.push({ routeIndex, colorIndex });
    utils.incrementPlayerTurn();
    if (
      store.gameW.game.lastPlayer === undefined &&
      utils.trainsLeft(utils.getMe()) <= 2
    ) {
      store.gameW.game.lastPlayer = utils.myIndex();
      store.gameW.info.alert = "this is the last turn";
    }
    store.update(
      `bought ${Cities[route.start].name} → ${
        Cities[route.end].name
      } for ${colors.map((c) => Color[c]).join(",")}`
    );
  }

  trainsLeft(player: PlayerType): number {
    return (
      utils.NUM_TRAINS -
      (player.routeIndices || [])
        .map((i) => Routes[i.routeIndex])
        .map((r) => r.length)
        .sum()
    );
  }
}

const utils = new Utils();

export default utils;

export { store };
