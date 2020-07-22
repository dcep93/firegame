import minimax from "../../../../shared/minimax";
import { Token } from "./bank";
import { GameType, PlayerType } from "./NewGame";
import utils, { store } from "./utils";

type ChildrenType = { [move: string]: GameType };

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
  const oppScore = utils.getScore(opp);
  if (oppScore >= 15) {
    if (utils.getScore(me) === oppScore) {
      return opp.cards!.length - me.cards!.length;
    }
  }
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

function childrenTakeTokens(s: GameType, children: ChildrenType): void {}

function childrenReserveCard(s: GameType, children: ChildrenType): void {}

function childrenBuyCard(s: GameType, children: ChildrenType): void {}

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
