import React from "react";
import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";
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
  const [playerName, setPlayerName] = React.useState("");
  const [editingValues, setEditingValues] = React.useState<
    Record<string, string>
  >({});
  const [focusedCategoryIndex, setFocusedCategoryIndex] = React.useState<
    number | null
  >(null);
  const newPlayer = () => {
    const trimmedPlayerName = playerName.trim();
    if (trimmedPlayerName === "") return Promise.resolve();
    return Promise.resolve(trimmedPlayerName)
      .then((playerName) =>
        Promise.resolve()
          .then(
            () =>
              (store.gameW.game.scoreSheet = Object.assign(
                { [playerName]: { [-1]: 0 } },
                store.gameW.game.scoreSheet
              ))
          )
          .then(() => store.update(`${playerName} joined`))
      )
      .then(() => setPlayerName(""));
  };
  const updateScore = (
    playerName: string,
    categoryIndex: number,
    value: string
  ) =>
    Promise.resolve().then((): boolean => {
      const previousValue =
        store.gameW.game.scoreSheet![playerName][categoryIndex];
      if (value.trim() === "") {
        if (previousValue === undefined) return false;
        delete store.gameW.game.scoreSheet![playerName][categoryIndex];
        return true;
      }
      const parsedValue = Number.parseInt(value, 10);
      if (Number.isNaN(parsedValue)) return false;
      if (previousValue === parsedValue) return false;
      store.gameW.game.scoreSheet![playerName][categoryIndex] = parsedValue;
      return true;
    });
  const inputKey = (playerName: string, categoryIndex: number) =>
    `${playerName}:${categoryIndex}`;

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
              <input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              ></input>
              <input
                type="submit"
                value={"+"}
                disabled={playerName.trim() === ""}
              ></input>
            </form>
          </div>
          {categories.map((c, i) => (
            <div
              className={focusedCategoryIndex === i ? css.focusedCategory : ""}
              key={i}
              style={{ whiteSpace: "nowrap" }}
            >
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
                    value={
                      editingValues[inputKey(playerName, i)] ??
                      store.gameW.game.scoreSheet![playerName][i]?.toString() ??
                      ""
                    }
                    onChange={(e) => {
                      const key = inputKey(playerName, i);
                      const value = (e.target as HTMLInputElement).value;
                      setEditingValues((prev) => ({ ...prev, [key]: value }));
                      Promise.resolve()
                        .then(() => updateScore(playerName, i, value))
                        .then((didUpdate) => {
                          if (didUpdate) {
                            store.update("updated scores");
                          }
                        });
                    }}
                    onFocus={() => setFocusedCategoryIndex(i)}
                    onBlur={() => {
                      const key = inputKey(playerName, i);
                      setFocusedCategoryIndex((focused) =>
                        focused === i ? null : focused
                      );
                      setEditingValues((prev) => {
                        const next = { ...prev };
                        delete next[key];
                        return next;
                      });
                    }}
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
