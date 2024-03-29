import minimax from "../../../../shared/minimax";
import { Card, Level, Token, TokensGroup, TokenToEmoji } from "./bank";
import { GameType, PlayerType } from "./NewGame";
import utils, { store } from "./utils";

// @ts-ignore
window.ai = ai;
// @ts-ignore
window.h = () => heuristic(store.gameW.game);

type ChildrenType = { [move: string]: GameType };

const profile: { [key: string]: number } = {};

function log<T>(key: string, f: () => T): T {
  const start = Date.now();
  const rval = f();
  const end = Date.now();
  profile[key] = (profile[key] || 0) + (end - start);
  return rval;
}

function ai(depth: number): number | null {
  if (store.gameW.game.players.length !== 2) {
    console.log("need exactly 2 players");
    return null;
  }
  const state = utils.copy(store.gameW.game);
  Object.values(state.cards).forEach((c) => c!.splice(4));
  const rval = minimax(state, depth, {
    heuristic,
    stateToChildren,
    maximizing,
    hash: (s: GameType) => s.players,
    log,
  });
  Object.entries(profile)
    .map(([key, val]) => ({
      key,
      val,
    }))
    .filter((obj) => obj.val > 500)
    .forEach((obj) => console.log(obj.key, obj.val));
  return rval;
}

function heuristic(s: GameType): number {
  return log("heuristic", () => {
    const p1 = utils.getPlayer(0, s);
    const p2 = utils.getPlayer(1, s);
    const p1Score = utils.getScore(p1);
    const p2Score = utils.getScore(p2);
    if (p2Score >= 15 && p1Score === p2Score)
      return p2.cards!.length - p1.cards!.length;
    if (p1Score >= 15 || p2Score >= 15) return p1Score - p2Score;
    const p1H = playerHeuristic(p1);
    const p2H = playerHeuristic(p2);
    return p1H - p2H;
  });
}

function stateToChildren(s: GameType): ChildrenType {
  return log("stateToChildren", () => {
    const children = {};

    if (!(s.currentPlayer === 0 && s.over)) {
      childrenTakeTokens(s, children);
      childrenReserveCard(s, children);
      childrenBuyCard(s, children);
    }
    return children;
  });
}

function maximizing(s: GameType): boolean {
  return s.currentPlayer === 0;
}

function childrenTakeTokens(s: GameType, children: ChildrenType): void {
  return log("childrenTakeTokens", () => {
    const choices = Object.entries(s.tokens)
      .map(([t, num]) => ({
        t: parseInt(t) as Token,
        num,
      }))
      .filter((obj) => obj.num)
      .filter((obj) => obj.t !== Token.gold)
      .map((obj) => obj.t);
    choices
      .flatMap((a, i) =>
        choices
          .slice(i + 1)
          .flatMap((b, j) => choices.slice(i + j + 2).map((c) => [a, b, c]))
      )
      .forEach((triple) => {
        const child = utils.sCopy(s);
        child.tokens = utils.sCopy(child.tokens);
        child.players = child.players.slice();
        const me = utils.copy(utils.getCurrent(child));
        child.players[child.currentPlayer] = me;
        triple.forEach((t) => child.tokens[t]!--);
        if (!me.tokens) me.tokens = [];
        me.tokens = me.tokens.concat(triple).sort();
        child.currentPlayer = 1 - child.currentPlayer;
        putBackTokens(child, s.currentPlayer, triple, children);
      });
  });
}

function putBackTokens(
  s: GameType,
  myIndex: number,
  triple: Token[],
  children: ChildrenType
): void {
  log("putBackTokens", () => {
    const myTokens = s.players[myIndex]!.tokens!;
    var tokensToPutBack: Token[][];
    if (myTokens.length <= 10) {
      tokensToPutBack = [[]];
    } else {
      tokensToPutBack = Array.from(
        new Set(
          myTokens.flatMap((a, i) =>
            myTokens
              .slice(i + 1)
              .map((b) => [a, b])
              .sort()
              .map((ts) => JSON.stringify(ts))
          )
        )
      ).map((ts) => JSON.parse(ts));
    }
    tokensToPutBack.forEach((ts) => {
      const child = utils.sCopy(s);
      child.players = child.players.slice();
      const me = utils.copy(child.players[myIndex]!);
      child.players[myIndex] = me;
      const myChildTokens = me.tokens!;
      ts.forEach((t) => {
        myChildTokens.splice(myChildTokens.indexOf(t), 1);
      });
      const parts = [
        "t",
        triple.map((t) => TokenToEmoji[t]).join(""),
        ts.map((t) => Token[t]).join(""),
      ];
      children[parts.join(":")] = child;
    });
  });
}

function childrenReserveCard(s: GameType, children: ChildrenType): void {
  log("childrenReserveCard", () => {
    if ((utils.getCurrent(s).hand || []).length === 3) return;
    reserveFaceDown(s, children);
    Object.values(s.cards).forEach((cards) =>
      cards!
        .slice(0, 4)
        .map((card, index) => ({
          card,
          index,
        }))
        .filter((obj) => obj.card.color !== Token.gold)
        .forEach((obj) => {
          const child = utils.copy(s);
          const me = utils.getCurrent(child);
          if (child.tokens[Token.gold] > 0) {
            if (!me.tokens) me.tokens = [];
            me.tokens.push(Token.gold);
            child.tokens[Token.gold]--;
          }
          child.currentPlayer = 1 - child.currentPlayer;
          if (!me.hand) me.hand = [];
          me.hand.push(utils.copy(obj.card));
          me.hand.sort((a, b) =>
            JSON.stringify(a) < JSON.stringify(b) ? 1 : -1
          );
          child.cards[obj.card.level]![obj.index].color = Token.gold;
          const parts = ["r", Level[obj.card.level], obj.index + 1];
          children[parts.join(":")] = child;
        })
    );
  });
}

function reserveFaceDown(s: GameType, children: ChildrenType): void {
  const child = utils.sCopy(s);
  child.tokens = utils.sCopy(child.tokens);
  child.players = child.players.slice();
  const me = utils.copy(utils.getCurrent(child));
  child.players[child.currentPlayer] = me;
  child.currentPlayer = 1 - child.currentPlayer;
  if (!me.hand) me.hand = [];
  me.hand.push({
    level: Level.one,
    color: Token.gold,
    points: 0,
    price: {
      [Token.gold]: 100,
    },
  });
  if (child.tokens[Token.gold] > 0) {
    if (!me.tokens) me.tokens = [];
    me.tokens.push(Token.gold);
    child.tokens[Token.gold]--;
  }
  me.hand.sort((a, b) => (JSON.stringify(a) < JSON.stringify(b) ? 1 : -1));
  const parts = ["r", "fd", "x"];
  children[parts.join(":")] = child;
}

function childrenBuyCard(s: GameType, children: ChildrenType): void {
  return log("childrenBuyCard", () => {
    const me = utils.getCurrent(s);
    Object.values(s.cards).forEach((cards) =>
      cards!
        .slice(0, 4)
        .map((card, index) => ({
          card,
          index,
        }))
        .filter((obj) => obj.card.color !== Token.gold)
        .forEach((obj) => {
          const afterBuying = tokensAfterBuying(me, obj.card);
          Object.entries(afterBuying).forEach(([spent, childTokens]) => {
            const child = childFromBuy(s, obj.card, childTokens);
            const dummy = utils.copy(obj.card);
            dummy.color = Token.gold;
            child.cards[obj.card.level]![obj.index] = dummy;
            const parts = ["b", spent, Level[obj.card.level], obj.index + 1];
            children[parts.join(":")] = child;
          });
        })
    );
    (me.hand || [])
      .map((card, index) => ({ card, index }))
      .forEach((obj) => {
        const afterBuying = tokensAfterBuying(me, obj.card);
        Object.entries(afterBuying).forEach(([spent, childTokens]) => {
          const child = childFromBuy(s, obj.card, childTokens);
          utils.getPlayer(s.currentPlayer, child).hand!.splice(obj.index, 1);
          const parts = ["b", spent, "hand", obj.index + 1];
          children[parts.join(":")] = child;
        });
      });
  });
}

function childFromBuy(s: GameType, card: Card, childTokens: Token[]): GameType {
  return log("childFromBuy", () => {
    const child = utils.copy(s);
    const childMe = utils.getCurrent(child);
    childMe.tokens = childTokens;
    if (!childMe.cards) childMe.cards = [];
    childMe.cards.push(card);
    childMe.cards.sort((a, b) =>
      JSON.stringify(a) < JSON.stringify(b) ? 1 : -1
    );
    child.currentPlayer = 1 - child.currentPlayer;

    const myColors: { [t in Token]?: number } = {};
    childMe.cards.forEach((c) => {
      myColors[c.color] = 1 + (myColors[c.color] || 0);
    });
    (child.nobles || [])
      .map((noble, index) => ({ noble, index }))
      .filter(
        (obj) =>
          Object.entries(obj.noble)
            .map(([token, number]) => ({
              token: parseInt(token) as Token,
              number,
            }))
            .map((obj) => (myColors[obj.token] || 0) < obj.number!)
            .filter(Boolean).length === 0
      )
      .forEach((obj, time) => {
        child.nobles!.splice(obj.index - time, 1);
        childMe.nobles++;
      });

    return child;
  });
}

function tokensAfterBuying(
  me: PlayerType,
  card: Card
): { [spent: string]: Token[] } {
  return log("tokensAfterBuying", () => {
    const price = Object.assign({}, card.price);
    (me.cards || []).forEach((c) => price[c.color] && price[c.color]!--);
    const childTokens: TokensGroup = {};
    (me.tokens || []).forEach((t) => {
      if (!childTokens[t]) childTokens[t] = 0;
      childTokens[t]!++;
    });
    const required = spendMinimalGold(price, childTokens);
    const afterBuying = {};
    if (required) recursivelySpendGolds(required, childTokens, afterBuying);
    return afterBuying;
  });
}

function spendMinimalGold(
  price: TokensGroup,
  childTokens: TokensGroup
): TokensGroup | null {
  return log("spendMinimalGold", () => {
    const required: TokensGroup = { [Token.gold]: 0 };
    Object.entries(price)
      .map(([t, number]) => ({
        t: parseInt(t) as Token,
        number: number!,
      }))
      .forEach((obj) => {
        let toPay = Math.min(obj.number, childTokens[obj.t] || 0);
        required[Token.gold]! += obj.number - toPay;
        required[obj.t] = toPay;
      });
    if ((childTokens[Token.gold] || 0) < required[Token.gold]!) return null;
    return required;
  });
}

function recursivelySpendGolds(
  spent: TokensGroup,
  childTokens: TokensGroup,
  afterBuying: { [spentStr: string]: Token[] }
): void {
  return log("recursivelySpendGolds", () => {
    const spentStr = Object.entries(spent)
      .map(([t, num]) => TokenToEmoji[parseInt(t) as Token].repeat(num!))
      .join("");
    afterBuying[spentStr] = Object.entries(childTokens)
      .map(([t, num]) => ({ t: parseInt(t) as Token, num }))
      .flatMap((obj) => Array(obj.num! - (spent[obj.t] || 0)).fill(obj.t));
    if ((childTokens[Token.gold] || 0) > spent[Token.gold]!) {
      Object.keys(spent)
        .map((t) => parseInt(t) as Token)
        .filter((t) => t !== Token.gold && spent[t])
        .forEach((t) => {
          const rSpent = utils.sCopy(spent);
          rSpent[t]!--;
          rSpent[Token.gold]!++;
          recursivelySpendGolds(rSpent, childTokens, afterBuying);
        });
    }
  });
}

function playerHeuristic(p: PlayerType): number {
  const scoreFactor = 1;
  const handFactor = 0.1;
  const facedownHandFactor = 0.1;
  const tokenFactor = 0.1;
  const starFactor = 0.1;
  const cardFactor = 0.1;
  const parts = [
    scoreFactor * utils.getScore(p),
    handFactor * (p.hand || []).length,
    facedownHandFactor *
    (p.hand || []).filter((c) => c.color === Token.gold).length,
    tokenFactor * (p.tokens || []).length,
    starFactor * (p.tokens || []).filter((t) => t === Token.gold).length,
    cardFactor * (p.cards || []).length,
  ];
  const h = parts.reduce((a, b) => a + b, 0);
  return parseFloat(h.toFixed(5));
}

export default ai;
