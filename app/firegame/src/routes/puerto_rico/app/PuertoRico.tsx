import React from "react";
import css from "./index.module.css";
import Main from "./main/Main";
import Sidebar from "./sidebar/Sidebar";
import utils, { store } from "./utils/utils";

class PuertoRico extends React.Component {
  render() {
    if (store.gameW.game) utils.normalizeGame();
    const isMyTurn = utils.isMyTurn();
    return (
      <div className={`${css.appShell} ${isMyTurn ? css.myTurnShell : ""}`}>
        <div className={css.gameFrame}>
          <Sidebar />
          <div className={css.contentPanel}>{store.gameW.game && <Main />}</div>
        </div>
      </div>
    );
  }
}

export default PuertoRico;
