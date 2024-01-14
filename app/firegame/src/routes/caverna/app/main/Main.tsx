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
      <div style={{ width: "100%" }}>
        <div>
          <div className={styles.bubble}>
            {utils.getCurrent().userName}:{" "}
            {store.gameW.game.tasks.map((t) => Task[t.t])}
          </div>
        </div>
        <ActionsBoard />
        <div>
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
        <StoreBoard />
      </div>
    );
  }
}

export default Main;
