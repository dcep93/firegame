import React from "react";
import css from "./index.module.css";
import Main from "./main/Main";
import Sidebar from "./sidebar/Sidebar";
import { getThemeKey } from "./theme/base";
import { createSampleGame } from "./utils/NewGame";
import utils, { store } from "./utils/utils";

class PuertoRico extends React.Component<{}, { sampleVersion: number }> {
  state = { sampleVersion: 0 };

  render() {
    const realGame = store.gameW.game;
    if (realGame) utils.normalizeGame();
    const game = realGame || createSampleGame({ lobby: store.lobby, themeKey: getThemeKey() });
    const isMyTurn = realGame && utils.isMyTurn();
    return (
      <div className={`${css.appShell} ${isMyTurn ? css.myTurnShell : ""}`}>
        <div className={css.gameFrame}>
          <Sidebar onPreGameThemeChange={this.refreshSample.bind(this)} />
          <div className={css.contentPanel}>
            <Main game={game} readOnly={!realGame} />
          </div>
        </div>
      </div>
    );
  }

  refreshSample(): void {
    this.setState((state) => ({ sampleVersion: state.sampleVersion + 1 }));
  }
}

export default PuertoRico;
