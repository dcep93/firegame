import React from "react";
import styles from "../../../../shared/styles.module.css";
import utils, { store } from "../utils/utils";

class Main extends React.Component {
  render() {
    return (
      <div>
        <div>
          <button
            onClick={() => {
              store.gameW.game.choices = utils.shuffle(
                store.gameW.game.choices || []
              );
              store.update("shuffled");
            }}
          >
            Shuffle
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              if (!store.gameW.game.choices) store.gameW.game.choices = [];
              const c = `new choice (${store.gameW.game.choices.length + 1})`;
              store.gameW.game.choices.push(c);
              store.update(`created ${c}`);
            }}
          >
            New Choice
          </button>
        </div>
        {(store.gameW.game.choices || []).map((c, i) => (
          <div
            className={styles.bubble}
            key={i}
            onClick={() => {
              store.gameW.game.choices.splice(i, 1);
              store.update(`removed ${c} (${i + 1})`);
            }}
          >
            ({i + 1}) {c}
          </div>
        ))}
      </div>
    );
  }
}

export default Main;
