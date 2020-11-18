import React from "react";
import styles from "../../../../shared/styles.module.css";
import { FoodEnum } from "../utils/types";
import { store } from "../utils/utils";

class Feeder extends React.Component {
  render() {
    return (
      <div className={styles.bubble}>
        <h2>Feeder</h2>
        <pre>
          {store.gameW.game.feeder.map((food) => FoodEnum[food]).join(" ")}
        </pre>
      </div>
    );
  }
}

export default Feeder;
