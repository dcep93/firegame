import React from "react";
import styles from "../../../../shared/styles.module.css";
import wStyles from "../index.module.css";
import bank from "../utils/bank";
import { BonusType, CardType } from "../utils/types";
import utils, { store } from "../utils/utils";

class Hand extends React.Component<{
  trashSelected: boolean;
  selectTrash: () => void;
}> {
  render() {
    const me = utils.getMe();
    if (!me) return;
    return (
      <>
        <div>
          <div className={styles.bubble}>
            <h2>Hand</h2>
            {(me.hand || []).map(this.renderHandCard.bind(this))}
          </div>
        </div>
        <div className={styles.flex}>
          <div className={styles.bubble}>
            <h2>Bonuses</h2>
            {me.bonuses.map(this.renderBonusCard.bind(this))}
          </div>
          <div className={wStyles.playerButtons}>
            <div>
              {this.toggler("trash")}
              {this.toggler("lay_egg")}
              {this.toggler("cache_food")}
              <br />
              {this.toggler("tuck_from_hand")}
              {this.toggler("tuck_from_deck")}
            </div>
            <button onClick={this.drawCard}>Draw Card</button>
            <button onClick={this.drawBonus}>Draw Bonus</button>
            <button onClick={this.shuffle}>Shuffle</button>
            {utils.isMyTurn() && (
              <button onClick={this.endTurn}>End Turn</button>
            )}
          </div>
        </div>
      </>
    );
  }

  toggler(key: string) {
    return (
      <h5
        className={`${styles.bubble} ${
          this.props.trashSelected && styles.grey
        }`}
        onClick={this.props.selectTrash}
      >
        {key.replace(/_/g, " ")}
      </h5>
    );
  }

  drawCard(): void {
    const me = utils.getMe();
    if (!me.hand) me.hand = [];
    me.hand.push(store.gameW.game.deck.shift()!);
    store.update("drew a card");
  }

  drawBonus(): void {
    utils.getMe().bonuses.push(store.gameW.game.bonuses.shift()!);
    store.update("drew a bonus");
  }

  shuffle(): void {
    utils.shuffle(store.gameW.game.deck);
    utils.shuffle(store.gameW.game.bonuses);
    store.update("shuffled");
  }

  endTurn(): void {
    utils.incrementPlayerTurn();
    store.update("finished turn");
  }

  renderHandCard(index: number) {
    const card: CardType = bank.cards[index];
    return (
      <div
        key={index}
        className={`${styles.bubble} ${wStyles.bird}`}
        title={utils.cardTitle(card)}
        onClick={() => this.prioritize(index, utils.getMe().hand!, "card")}
      >
        {utils.cardItems(card)}
      </div>
    );
  }

  renderBonusCard(index: number) {
    const bonus: BonusType = bank.bonuses[index];
    return (
      <div
        key={index}
        className={`${styles.bubble} ${wStyles.bonus}`}
        title={utils.bonusTitle(bonus)}
        onClick={() => this.prioritize(index, utils.getMe().bonuses, "bonus")}
      >
        <h5>{bonus.name}</h5>
        <div>{bonus.condition}</div>
        <div>---</div>
        <div className={styles.prewrap}>
          {bonus.vp_text.replace("; ", "\n")}
        </div>
        <div>{bonus.percent}%</div>
      </div>
    );
  }

  prioritize(index: number, obj: number[], name: string): void {
    const item = obj.splice(obj.indexOf(index), 1)[0];
    if (this.props.trashSelected) {
      store.update("trashed a bonus");
    } else {
      obj.unshift(item);
      store.update("prioritized a bonus");
    }
  }
}

export default Hand;
