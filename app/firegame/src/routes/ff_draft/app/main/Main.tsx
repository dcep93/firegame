import React from "react";
import utils, { store } from "../utils/utils";
import players from "./players.json";

import styles from "../../../../shared/styles.module.css";

class Main extends React.Component {
  render() {
    return (
      <div className={styles.bubble} style={{ width: "100%" }}>
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
          }}
        >
          <h2>FFDraft</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              minHeight: 0,
              overflow: "scroll",
            }}
          >
            {players
              .map((p, i) => ({ p, pick: (store.gameW.game.picks || {})[i] }))
              .map(({ p, pick }, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: pick ? "grey" : "",
                  }}
                  onClick={() => {
                    if (!store.gameW.game.picks) store.gameW.game.picks = {};
                    store.gameW.game.picks![i] = {
                      manager: utils.getMe().userName,
                      index: Object.keys(store.gameW.game.picks!).length + 1,
                    };
                    store.update(`picked ${p}`);
                  }}
                >
                  {p}
                  {pick && (
                    <span>
                      {" "}
                      &lt;{pick.manager} {pick.index}&gt;
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
