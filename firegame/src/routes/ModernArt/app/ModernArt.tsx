import React from "react";
import styles from "../../../shared/styles.module.css";
import Main from "./main/Main";
import Sidebar from "./sidebar/Sidebar";
import utils, { store } from "./utils/utils";

class ModernArt extends React.Component {
  render() {
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

export default ModernArt;
