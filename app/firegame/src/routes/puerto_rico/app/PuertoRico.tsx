import React from "react";
import styles from "../../../shared/styles.module.css";
import Main from "./main/Main";
import Sidebar from "./sidebar/Sidebar";
import utils, { store } from "./utils/utils";

class PuertoRico extends React.Component {
  render() {
    if (store.gameW.game) utils.normalizeGame();
    return (
      <div className={`${utils.isMyTurn() && styles.my_turn}`}>
        <div className={styles.main}>
          <Sidebar />
          <div className={styles.content}>{store.gameW.game && <Main />}</div>
        </div>
      </div>
    );
  }
}

export default PuertoRico;
