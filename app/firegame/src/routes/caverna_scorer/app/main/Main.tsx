import React from "react";
import styles from "../../../../shared/styles.module.css";
import { store } from "../utils/utils";

const categories = [
  "farm animal and dog",
  "missing type of farm animal (-2)",
  "grain (0.5 rounded up)",
  "vegetable",
  "ruby",
  "dwarf",
  "unused space (-1)",
  "fixed score tiles",
  "variable score tiles",
  "gold coins",
];

export default function Main() {
  const ref = React.useRef<HTMLInputElement>(null);
  const newPlayer = () =>
    Promise.resolve(ref.current!.value).then((playerName) =>
      Promise.resolve()
        .then(
          () =>
            (store.gameW.game.scoreSheet = Object.assign(
              { [playerName]: { [-1]: 0 } },
              store.gameW.game.scoreSheet
            ))
        )
        .then(() => store.update(`${playerName} joined`))
    );

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div
          className={styles.bubble}
          style={{
            backgroundColor: "lightgray",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex" }}>
            <span>name:</span>{" "}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                newPlayer();
              }}
            >
              <input ref={ref}></input>
              <input type="submit" value={"+"}></input>
            </form>
          </div>
          {categories.map((c, i) => (
            <div key={i} style={{ whiteSpace: "nowrap" }}>
              {c}
            </div>
          ))}
        </div>
        {Object.entries(store.gameW.game.scoreSheet || {}).map(
          ([playerName, playerScores], i) => (
            <div key={i} className={styles.bubble}>
              <div>
                {playerName} (
                {Object.values(playerScores).reduce((a, b) => a + b, 0)})
                <button
                  onClick={() =>
                    Promise.resolve()
                      .then(
                        () => delete store.gameW.game.scoreSheet![playerName]
                      )
                      .then(() => store.update(`${playerName} left`))
                  }
                >
                  x
                </button>
              </div>
              {categories.map((c, i) => (
                <div key={i}>
                  <input
                    defaultValue={store.gameW.game.scoreSheet![playerName][
                      i
                    ]?.toString()}
                    onChange={(e) =>
                      Promise.resolve()
                        .then(
                          () =>
                            (store.gameW.game.scoreSheet![playerName][i] =
                              parseInt(e.target.value))
                        )
                        .then(() => store.update("."))
                    }
                  />
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
