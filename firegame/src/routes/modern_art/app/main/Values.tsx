import React from "react";
import styles from "../../../../shared/styles.module.css";
import { Artist } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Values extends React.Component {
  render() {
    return (
      <div className={styles.bubble}>
        <div className={styles.flex}>
          {utils.enumArray(Artist).map((a, i) => (
            <div className={styles.bubble} key={i}>
              <div>
                {Artist[a]} - {utils.countArt(a)}
              </div>
              {utils.count(store.gameW.game.round).map((r, j) => (
                <div key={j}>{store.gameW.game.values[a as Artist][r]}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Values;
