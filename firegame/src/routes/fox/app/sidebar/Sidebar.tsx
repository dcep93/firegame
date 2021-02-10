import React from "react";
import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import styles from "../../../../shared/styles.module.css";
import NewGame, { Params } from "../utils/NewGame";
import { shared as utils, store } from "../utils/utils";

class Sidebar extends SharedSidebar<Params> {
  name = "Fox in the Forest";
  NewGame = NewGame;
  isMyTurn = utils.isMyTurn.bind(utils);

  getParams(): Params {
    return {
      lobby: store.lobby,
    };
  }

  renderPlayer(userId: string, userName: string): JSX.Element {
    var prefix = "";
    if (store.gameW.info.host === userId) prefix += "(host) ";
    if (store.me.userId === userId) prefix += "(you) ";
    const parts = [<p key={"name"}>{`${prefix}${store.lobby[userId]}`}</p>];
    const player = store.gameW.game?.players[utils.playerIndexById(userId)];
    if (player) {
      parts.push(<p key={"tricks"}>tricks: {player.tricks}</p>);
      parts.push(<p key={"score"}>score: {player.score}</p>);
    }
    return (
      <div key={userId} className={styles.bubble}>
        {parts}
      </div>
    );
  }
}

export default Sidebar;
