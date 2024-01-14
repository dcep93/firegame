import React from "react";
import styles from "../../../../shared/styles.module.css";
import { Task } from "../utils/NewGame";
import utils, { store } from "../utils/utils";
import ActionsBoard from "./ActionsBoard";
import CardActions from "./CardActions";
import Player from "./Player";
import StoreBoard from "./StoreBoard";

class Main extends React.Component {
  render() {
    return (
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <div>
          <div className={styles.bubble}>
            <div>current: {utils.getCurrent().userName}</div>
            <div>
              {store.gameW.game.tasks.map((t, i) => (
                <div key={i}>
                  <div>{Task[t.t]}</div>
                  {t.d === undefined ? null : JSON.stringify(t.d)}
                </div>
              ))}
            </div>
          </div>
        </div>
        <ActionsBoard />
        <div style={{ alignSelf: "flex-end" }}>
          {store.gameW.game.players
            .map(
              (_, i) =>
                store.gameW.game.players[
                  (i + store.gameW.game.players.length - utils.myIndex()) %
                    store.gameW.game.players.length
                ]
            )
            .map((p, i) => (
              <Player key={i} p={p} />
            ))}
        </div>
        <CardActions />
        <StoreBoard selected={undefined} />
      </div>
    );
  }
}

export default Main;
