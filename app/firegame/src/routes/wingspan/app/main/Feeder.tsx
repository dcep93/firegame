import React from "react";
import styles from "../../../../shared/styles.module.css";
import { FoodEnum } from "../utils/types";
import utils, { store } from "../utils/utils";

class Feeder extends React.Component {
  render() {
    return (
      <div className={styles.bubble}>
        <h2 onClick={this.reroll}>Feeder</h2>
        <div>
          {(store.gameW.game.feeder || [])
            .map((_, i) => i)
            .map(this.food.bind(this))}
        </div>
      </div>
    );
  }

  food(index: number) {
    var food = store.gameW.game.feeder[index];
    if (food === FoodEnum.wild) {
      return (
        <div key={index} className={styles.bubble}>
          <div
            onClick={() => this.gainFood(index, FoodEnum.invertebrate)}
            className={styles.inline}
          >
            {FoodEnum[FoodEnum.invertebrate]}
          </div>
          {" / "}
          <div
            onClick={() => this.gainFood(index, FoodEnum.seed)}
            className={styles.inline}
          >
            {FoodEnum[FoodEnum.seed]}
          </div>
        </div>
      );
    } else {
      return (
        <div
          onClick={() => this.gainFood(index, food)}
          key={index}
          className={styles.bubble}
        >
          {FoodEnum[food]}
        </div>
      );
    }
  }

  gainFood(index: number, food: FoodEnum) {
    const took = store.gameW.game.feeder.splice(index, 1)[0];
    utils.gainFood(food, 1);
    var msg = FoodEnum[food];
    if (took === FoodEnum.wild) msg += ` (${FoodEnum[FoodEnum.wild]})`;
    store.update(`took ${msg}`);
  }

  reroll(): void {
    utils.reroll(store.gameW.game);
    store.update("rerolled");
  }
}

export default Feeder;
