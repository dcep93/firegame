import minimax from "../../../../shared/minimax";
import { Card, Level, Token } from "./bank";
import { GameType, PlayerType } from "./NewGame";
import utils, { store } from "./utils";

type ChildrenType = { [move: string]: GameType };

function copy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function ai(depth: number, top: number): void {
  if (store.gameW.game.players.length !== 2) {
    console.log("need exactly 2 players");
    return;
  }
  const results = minimax(
    store.gameW.game,
    heuristic,
    stateToChildren,
    depth,
    top
  );
  console.log(results.map((r) => r.join(" ")).join("\n"));
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
  // todo
}

function childrenReserveCard(s: GameType, children: ChildrenType): void {
  if ((utils.getCurrent(s).hand || []).length === 3) return;
  // todo reserve face down
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
        if (!me.hand) me.hand = [];
        me.hand.push(copy(obj.card));
        obj.card.color = Token.gold;
        child.currentPlayer = 1 - child.currentPlayer;
        const message = `r:${Level[obj.card.level]}:${obj.index + 1}`;
        children[message] = child;
      })
  );
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
  // todo
  const price = Object.assign({}, card.price);
  (me.cards || []).forEach((c) => price[c.color] && price[c.color]!--);
  const childTokens = (me.tokens || []).slice();
  return {};
}

function playerHeuristic(p: PlayerType): number {
  const scoreFactor = 1;
  const handFactor = 0.1;
  const tokenFactor = 0.1;
  const starFactor = 0.1;
  const cardFactor = 0.1;
  return (
    scoreFactor * utils.getScore(p) +
    handFactor * (p.hand || []).length +
    tokenFactor * (p.tokens || []).length +
    starFactor * (p.tokens || []).filter((t) => t === Token.gold).length +
    cardFactor * (p.cards || []).length
  );
}

export default ai;
