import React from "react";
import { Card, Level, Token, TokenToEmoji } from "../utils/bank";
import { PlayerType } from "../utils/NewGame";
import utils, { store } from "../utils/utils";
import Cards from "./Cards";
import Hand from "./Hand";
import MyTokens from "./MyTokens";
import Nobles from "./Nobles";
import Players from "./Players";
import TokenBank from "./TokenBank";

class Main extends React.Component<
  {},
  { goldSelected: boolean; selectedTokens: { [n: number]: boolean } }
> {
  constructor(props: {}) {
    super(props);
    this.state = { goldSelected: false, selectedTokens: {} };
  }

  render() {
    return (
      <>
        <div>
          <div>
            <div>
              <TokenBank
                goldSelected={this.state.goldSelected}
                selectGold={this.selectGold.bind(this)}
              />
              <MyTokens
                selectedTokens={this.state.selectedTokens}
                selectToken={this.selectToken.bind(this)}
              />
              <Nobles />
            </div>
            <div>
              <Hand buyHandCard={this.buyHandCard.bind(this)} />
            </div>
          </div>
          <div>
            <Players />
          </div>
        </div>
        <div>
          <Cards
            selectGold={this.selectGold.bind(this)}
            goldSelected={this.state.goldSelected}
            buyCard={this.buyCard.bind(this)}
          />
        </div>
      </>
    );
  }

  selectToken(index: number) {
    const selectedTokens = Object.assign(this.state.selectedTokens, {
      [index]: !this.state.selectedTokens[index],
    });
    this.setState({ selectedTokens });
  }

  buyCard(level: Level, index: number) {
    const card = store.gameW.game.cards[level]![index];
    if (!this.buyCardHelper(card)) return;
    store.gameW.game.cards[level]!.splice(index, 1);
    utils.finishTurn(
      `bought a ${TokenToEmoji[card.color]} level ${
        Level[card.level]
      } card (number ${index + 1})`
    );
  }

  buyHandCard(index: number) {
    if (!utils.isMyTurn()) return;
    const me = utils.getMe();
    const card = me.hand![index];
    if (!this.buyCardHelper(card)) return;
    me.hand!.splice(index, 1);
    utils.finishTurn(
      `bought a ${TokenToEmoji[card.color]} level ${
        Level[card.level]
      } card from hand`
    );
  }

  buyCardHelper(card: Card): boolean {
    const price = Object.assign({}, card.price);
    const me = utils.getMe();
    (me.cards || []).forEach((c) => price[c.color] && price[c.color]!--);
    var goldToPay = 0;
    var selectedTokens = Object.entries(this.state.selectedTokens)
      .map(([index, selected]) => ({
        index: parseInt(index),
        selected,
      }))
      .filter((obj) => obj.selected)
      .map((obj) => obj.index);
    selectedTokens
      .map((index) => me.tokens![index])
      .forEach((t) => {
        if (t === Token.gold) {
          goldToPay++;
          return;
        }
        price[t]!--;
      });
    var outstanding = 0;
    Object.keys(price)
      .map((t) => parseInt(t))
      .forEach((t: Token) => {
        let bill: number = price[t]!;
        if (bill < 0) outstanding = NaN;
        outstanding += bill;
      });
    if (outstanding !== goldToPay) {
      if (selectedTokens.length === 0) {
        selectedTokens = this.getMinimalTokens(card);
        if (selectedTokens.length === 0) {
          alert("Cannot afford");
          return false;
        }
      } else {
        alert("Incorrect payment");
        return false;
      }
    }
    selectedTokens
      .sort()
      .forEach(
        (index, time) =>
          store.gameW.game.tokens[me.tokens!.splice(index - time, 1)[0]!]++
      );
    if (!me.cards) me.cards = [];
    me.cards.push(card);
    me.cards.sort((a, b) => this.handValue(a) - this.handValue(b));
    const myColors: { [t in Token]?: number } = {};
    me.cards.forEach((c) => {
      myColors[c.color] = 1 + (myColors[c.color] || 0);
    });
    if (store.gameW.game.nobles) {
      store.gameW.game.nobles
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
          store.gameW.game.nobles!.splice(obj.index - time, 1);
          me.nobles++;
        });
    }
    if (!store.gameW.game.over && utils.getScore(me) >= 15) {
      store.gameW.info.alert = "This is the last round.";
      store.gameW.game.over = true;
    }
    this.setState({ selectedTokens: {}, goldSelected: false });
    return true;
  }

  getMinimalTokens(card: Card): number[] {
    const me = utils.getMe();
    if (me.tokens) {
      const price = Object.assign({}, card.price);
      (me.cards || []).forEach((c) => price[c.color] && price[c.color]!--);
      const selectedTokens = Object.keys(price)
        .map((i) => parseInt(i) as Token)
        .map((t) => this.getNTokens(t, price[t]!, me))
        .flatMap((i) => i);
      const goldNeeded =
        Object.values(card.price)
          .filter((i) => i)
          .sum() - selectedTokens.length;
      const goldIndices = this.getNTokens(Token.gold, goldNeeded, me);
      if (goldIndices.length === goldNeeded) {
        selectedTokens.push(...goldIndices);
        return selectedTokens;
      }
    }
    return [];
  }

  getNTokens(t: Token, num: number, me: PlayerType): number[] {
    const tokens: number[] = [];
    for (let i = 0; i < me.tokens!.length; i++) {
      let token = me.tokens![i];
      if (token === t) {
        tokens.push(i);
        if (--num === 0) break;
      }
    }
    return tokens;
  }

  handValue(c: Card) {
    return parseInt(
      `${c.color}${c.level}.${Array.from(JSON.stringify(c)).map((i) =>
        i.codePointAt(0)
      )}`
    );
  }

  selectGold(allowSelect: boolean = false) {
    this.setState({
      goldSelected: allowSelect && !this.state.goldSelected,
    });
  }
}

export default Main;
