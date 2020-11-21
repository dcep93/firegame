import React from "react";
import styles from "../../../../shared/styles.module.css";
import bank from "../utils/bank";
import utils, { store } from "../utils/utils";

class Cards extends React.Component {
  render() {
    return (
      <div className={styles.bubble}>
        <h2 onClick={this.flipAll.bind(this)}>Cards</h2>
        <div className={styles.flex}>
          {store.gameW.game.publicCards.map((cardIndex, i) => (
            <div
              key={i}
              className={styles.bubble}
              onClick={() => this.click(cardIndex, i)}
            >
              {this.renderCard(cardIndex)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  renderCard(cardIndex: number) {
    if (cardIndex === -1) return null;
    return utils.cardItems(bank.cards[cardIndex]);
  }

  flipAll(): void {
    store.gameW.game.publicCards = store.gameW.game.deck.splice(
      0,
      store.gameW.game.publicCards.length
    );
    store.update(`reset public cards`);
  }

  click(cardIndex: number, i: number): void {
    const me = utils.getMe();
    if (!me) return;
    if (cardIndex === -1) {
      store.gameW.game.publicCards[i] = store.gameW.game.deck.shift()!;
      store.update(`flipped a public card`);
    } else {
      store.gameW.game.publicCards[i] = -1;
      if (!me.hand) me.hand = [];
      me.hand.push(cardIndex);
      store.update(`took a public card`);
    }
  }
}

export default Cards;
