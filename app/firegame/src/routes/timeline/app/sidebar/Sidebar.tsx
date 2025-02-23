import React, { RefObject } from "react";

import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame, { GameType } from "../utils/NewGame";
import { store, shared as utils } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";
import Settings from "./Settings";

class Sidebar extends SharedSidebar {
  settingsRef: RefObject<Settings> = React.createRef();
  name = "Timeline";
  NewGame = NewGame;
  utils = utils;
  rules = "";

  renderStartNewGame() {
    return (
      <div>
        <Settings ref={this.settingsRef} />
        <button onClick={this.startNewGame.bind(this)}>New Game</button>
      </div>
    );
  }

  getParams() {
    return this.settingsRef.current!.getParams();
  }

  maybeSyncParams() {
    super.maybeSyncParams();
    this.settingsRef.current?.maybeSyncParams();
  }

  renderInfo() {
    const game: GameType = store.gameW.game;
    if (!game) return null;
    return (
      <div className={styles.bubble}>
        <div className={css.info}>
          <p>{game.title}</p>
          <p>
            Set Id: <span>{game.setId}</span>
          </p>
          <p>
            Current Player:{" "}
            <span>{game.players[game.currentPlayer].userName}</span>
          </p>
          <div>
            {game.players.map((player) => (
              <p key={player.index}>
                {player.userName} ({(player.hand || []).length})
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
