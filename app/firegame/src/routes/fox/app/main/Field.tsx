import React from "react";

import { getText, store } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";
import { PlayerType } from "../utils/NewGame";

class Field extends React.Component {
  render() {
    const l = store.gameW.game.lead || { suit: "-", value: 0 };
    return (
      <div>
        {store.gameW.game.players.map((p) => this.renderPlayer(p))}
        <div>
          <div className={styles.bubble}>
            <p>Trump</p>
            <p>{getText(store.gameW.game.trump)}</p>
          </div>
          <div className={styles.bubble}>
            <p>Lead</p>
            <p>{getText(l)}</p>
          </div>
          <div className={styles.bubble}>
            <p>Last</p>
            <p>{store.gameW.game.previous}</p>
          </div>
        </div>
      </div>
    );
  }

  renderPlayer(player: PlayerType): JSX.Element {
    const parts = [<p key={"name"}>{player.userName}</p>];
    // const player = store.gameW.game?.players[utils.playerIndexById(userId)];
    if (player) {
      parts.push(<p key={"tricks"}>tricks: {player.tricks}</p>);
      parts.push(<p key={"score"}>score: {player.score}</p>);
    }
    return (
      <div key={player.userId} className={styles.bubble}>
        {parts}
      </div>
    );
  }
}

export default Field;
