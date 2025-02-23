import React from "react";
import styles from "../../../shared/styles.module.css";
import Main from "./main/Main";
import Sidebar from "./sidebar/Sidebar";
import utils, { store } from "./utils/utils";

class SecretHitler extends React.Component {
  render() {
    return (
      <div
        className={[styles.main, utils.isMyTurn() && styles.my_turn].join(" ")}
      >
        <Sidebar />
        <div className={styles.content}>{store.gameW.game && <Main />}</div>
      </div>
    );
  }
}

export default SecretHitler;
