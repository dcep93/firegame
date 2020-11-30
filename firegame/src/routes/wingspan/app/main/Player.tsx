import React from "react";
import styles from "../../../../shared/styles.module.css";
import { shared } from "../../../timeline/app/utils/utils";
import wStyles from "../index.module.css";
import bank from "../utils/bank";
import GoalsBank from "../utils/goals_bank";
import { BonusType, CardType } from "../utils/types";
import utils, { store } from "../utils/utils";

class Hand extends React.Component<{
  selected: string | null;
  select: (key: string) => void;
  selectHand: (handIndex: number) => boolean;
}> {
  render() {
    const me = utils.getMe();
    if (!me) return null;
    return (
      <>
        <div>
          <div className={styles.bubble}>
            <h2 onClick={this.drawCard}>Hand</h2>
            {(me.hand || []).map(this.renderHandCard.bind(this))}
          </div>
        </div>
        <div className={styles.flex}>
          <div className={styles.bubble}>
            <h2 onClick={this.drawBonus}>Bonuses</h2>
            {me.bonuses.map(this.renderBonusCard.bind(this))}
          </div>
          <div className={wStyles.playerButtons}>
            <div>{this.toggler("trash")}</div>
            <button onClick={this.shuffle}>Shuffle</button>
            {utils.isMyTurn() && (
              <button onClick={this.endTurn.bind(this)}>End Turn</button>
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
          this.props.selected === key && styles.grey
        }`}
        onClick={() => this.props.select(key)}
      >
        {key.replace(/_/g, " ")}
      </h5>
    );
  }

  drawCard(): void {
    utils.draw(utils.getMe());
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
    const game = store.gameW.game;
    utils.incrementPlayerTurn();
    game.publicCards = game.publicCards.map((i) =>
      i === -1 ? game.deck.shift()! : i
    );
    if (utils.currentIndex() === game.startingPlayer) {
      game.turnNumber++;
      if (game.turnNumber + game.roundNumber === 10) {
        this.assignGoals();
        game.publicCards = game.deck.splice(0, game.publicCards.length);
        game.turnNumber = 1;
        game.roundNumber++;
        utils.incrementPlayerTurn();
        game.startingPlayer = game.currentPlayer;
        store.update("finished turn - new round");
        return;
      }
    }
    store.update("finished turn");
  }

  assignGoals(): void {
    const game = store.gameW.game;
    const g = game.goals[game.roundNumber - 1];
    const goal = GoalsBank[g.index];
    const scoresA = game.players
      .map((p, i) => ({ p, i, s: goal.f(p) }))
      .sort((i) => i.s);
    const scoresD = utils.arrToDict(scoresA, (o) => o.s.toString());
    var offset = 0;
    Object.keys(scoresD)
      .map((i) => parseInt(i))
      .sort()
      .reverse()
      .forEach((key) => {
        const players = scoresD[key];
        shared.count(players.length).forEach((_) => {
          players.forEach((p) => (g.rankings[offset][p.i] = true));
          offset++;
        });
      });
  }

  renderHandCard(_: number, index: number) {
    const card: CardType = bank.cards[utils.getMe().hand![index]];
    return (
      <div
        key={index}
        className={styles.bubble}
        title={utils.cardTitle(card)}
        onClick={() => this.clickCard(index)}
      >
        {utils.cardItems(card)}
      </div>
    );
  }

  clickCard(index: number) {
    if (this.props.selectHand(index)) return;
    this.prioritize(index, utils.getMe().hand!, "card");
  }

  renderBonusCard(_: number, index: number) {
    const bonus: BonusType = bank.bonuses[utils.getMe().bonuses[index]];
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
    const item = obj.splice(index, 1)[0];
    if (this.props.selected === "trash") {
      store.update(`trashed a ${name}`);
    } else {
      obj.unshift(item);
      store.update(`prioritized a ${name}`);
    }
  }
}

export default Hand;
