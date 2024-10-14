import React from "react";
import styles from "../../../../shared/styles.module.css";
import { store } from "../utils/utils";

function Input(props: { value: string; onSubmit: (value: string) => void }) {
  const ref = React.useRef<HTMLInputElement>(null);
  return (
    <form
      style={{ display: "inline-block" }}
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit(ref.current!.value);
        store.update(".");
      }}
    >
      <input ref={ref} defaultValue={props.value} />
    </form>
  );
}

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
          <div>
            <span>+ </span>
            <Input
              value={""}
              onSubmit={(playerName) => {
                store.gameW.game.scoreSheet = Object.assign(
                  { [playerName]: { [-1]: 0 } },
                  store.gameW.game.scoreSheet
                );
              }}
            />
          </div>
          {categories.map((c, i) => (
            <div key={i}>{c}</div>
          ))}
        </div>
        {Object.entries(store.gameW.game.scoreSheet || {}).map(
          ([playerName, playerScores], i) => (
            <div key={i} className={styles.bubble}>
              <div>
                {playerName} (
                {Object.values(playerScores).reduce((a, b) => a + b, 0)})
              </div>
              {categories.map((c, i) => (
                <div key={i}>
                  <Input
                    value={store.gameW.game.scoreSheet![playerName][
                      i
                    ]?.toString()}
                    onSubmit={(value) =>
                      (store.gameW.game.scoreSheet![playerName][i] =
                        parseInt(value))
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
