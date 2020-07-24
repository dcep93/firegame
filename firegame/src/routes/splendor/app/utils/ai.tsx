import minimax from "../../../../shared/minimax";
import { Card, Level, Token, TokensGroup } from "./bank";
import { GameType, PlayerType } from "./NewGame";
import utils, { store } from "./utils";

type ChildrenType = { [move: string]: GameType };

function copy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function ai(depth: number): void {
  if (store.gameW.game.players.length !== 2) {
    console.log("need exactly 2 players");
    return;
  }
  minimax(store.gameW.game, depth, {
    heuristic,
    stateToChildren,
  });
}

function heuristic(s: GameType): number {
  const current = s.currentPlayer;
  const me = utils.getPlayer(current);
  const opp = utils.getPlayer(1 - current);
  const myScore = utils.getScore(me);
  const oppScore = utils.getScore(opp);
  if (oppScore >= 15 && myScore === oppScore)
    return opp.cards!.length - me.cards!.length;
  if (myScore >= 15 || oppScore >= 15) return myScore - oppScore;
  const myH = playerHeuristic(me);
  const oppH = playerHeuristic(opp);
  return myH - oppH;
}

function stateToChildren(s: GameType): ChildrenType {
  const children = {};
  if (!(s.currentPlayer === 0 && s.over)) {
    childrenTakeTokens(s, children);
    childrenReserveCard(s, children);
    childrenBuyCard(s, children);
  }
  return children;
}

function childrenTakeTokens(s: GameType, children: ChildrenType): void {
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
      const child = copy(s);
      triple.forEach((t) => child.tokens[t]!--);
      const me = utils.getCurrent(child);
      if (!me.tokens) me.tokens = [];
      me.tokens = me.tokens.concat(triple);
      child.currentPlayer = 1 - child.currentPlayer;
      putBackTokens(child, s.currentPlayer, triple, children);
    });
}

function putBackTokens(
  s: GameType,
  myIndex: number,
  triple: Token[],
  children: ChildrenType
): void {
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
    const child = copy(s);
    const myChildTokens = copy(child.players[myIndex]!.tokens!);
    ts.forEach((t) => {
      myChildTokens.splice(myChildTokens.indexOf(t), 1);
    });
    const message = `t:${triple.join("")}:${ts.map((t) => Token[t]).join("")}`;
    children[message] = child;
  });
}

function childrenReserveCard(s: GameType, children: ChildrenType): void {
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
        const child = copy(s);
        const me = utils.getCurrent(child);
        if (child.tokens[Token.gold] > 0) {
          if (!me.tokens) me.tokens = [];
          me.tokens.push(Token.gold);
          child.tokens[Token.gold]--;
        }
        child.currentPlayer = 1 - child.currentPlayer;
        if (!me.hand) me.hand = [];
        me.hand.push(copy(obj.card));
        obj.card.color = Token.gold;
        const message = `r:${Level[obj.card.level]}:${obj.index + 1}`;
        children[message] = child;
      })
  );
}

function reserveFaceDown(s: GameType, children: ChildrenType): void {
  const child = copy(s);
  const me = utils.getCurrent(child);
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
  const message = `r:facedown:x`;
  children[message] = child;
}

function childrenBuyCard(s: GameType, children: ChildrenType): void {
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
          const dummy = copy(obj.card);
          dummy.color = Token.gold;
          child.cards[obj.card.level]![obj.index] = dummy;
          const message = `b${spent}:${Level[obj.card.level]}:${obj.index + 1}`;
          children[message] = child;
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
        const message = `b${spent}:hand:${obj.index + 1}`;
        children[message] = child;
      });
    });
}

function childFromBuy(s: GameType, card: Card, childTokens: Token[]): GameType {
  const child = copy(s);
  const childMe = utils.getCurrent(child);
  childMe.tokens = childTokens;
  if (!childMe.cards) childMe.cards = [];
  childMe.cards.push(card);
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
}

function tokensAfterBuying(
  me: PlayerType,
  card: Card
): { [spent: string]: Token[] } {
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
}

function spendMinimalGold(
  price: TokensGroup,
  childTokens: TokensGroup
): TokensGroup | null {
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
}

function recursivelySpendGolds(
  spent: TokensGroup,
  childTokens: TokensGroup,
  afterBuying: { [spentStr: string]: Token[] }
): void {
  const spentStr = Object.entries(spent)
    .map(([t, num]) => Token[parseInt(t)].repeat(num!))
    .join("");
  afterBuying[spentStr] = Object.entries(childTokens)
    .map(([t, num]) => ({ t: parseInt(t) as Token, num }))
    .flatMap((obj) => Array(obj.num! - spent[obj.t]!).fill(obj.t));
  if ((childTokens[Token.gold] || 0) > spent[Token.gold]!) {
    Object.keys(spent)
      .map((t) => parseInt(t) as Token)
      .filter((t) => t !== Token.gold)
      .forEach((t) => {
        const rSpent = copy(spent);
        rSpent[t]!--;
        rSpent[Token.gold]!++;
        recursivelySpendGolds(spent, childTokens, afterBuying);
      });
  }
}

function playerHeuristic(p: PlayerType): number {
  const scoreFactor = 1;
  const handFactor = 0.1;
  const facedownHandFactor = 0.1;
  const tokenFactor = 0.1;
  const starFactor = 0.1;
  const cardFactor = 0.1;
  return (
    scoreFactor * utils.getScore(p) +
    handFactor * (p.hand || []).length +
    facedownHandFactor *
      (p.hand || []).filter((c) => c.color === Token.gold).length +
    tokenFactor * (p.tokens || []).length +
    starFactor * (p.tokens || []).filter((t) => t === Token.gold).length +
    cardFactor * (p.cards || []).length
  );
}

export default ai;
