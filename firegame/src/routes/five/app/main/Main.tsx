import React from "react";
import styles from "../../../../shared/styles.module.css";
import { Action } from "../utils/NewGame";
import { store } from "../utils/utils";

class Main extends React.Component {
  render() {
    return (
      <div>
        <div>
          {store.gameW.game.players.map((p, i) => (
            <div key={i}>
              <div className={styles.bubble}>
                <h2>{p.userName}</h2>
                <p>chips: {p.chips}</p>
                {p.blocked !== undefined && <p>blocked: {Action[p.blocked]}</p>}
                <p>
                  lights:{" "}
                  {Object.entries(p.lights)
                    .filter(([a, l]) => l)
                    .map(([a, l]) => Action[parseInt(a)])
                    .join(" ")}
                </p>
                <p>
                  last round:{" "}
                  {(p.lastRound || []).map((a) => Action[a]).join(" ")}
                </p>
                {p.twoInARow !== undefined && (
                  <p>two in a row: {Action[p.twoInARow]}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div>{/* todo - actions and submit and block selection */}</div>
      </div>
    );
  }
}

export default Main;
