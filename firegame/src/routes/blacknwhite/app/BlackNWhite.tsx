import React from "react";
import styles from "../../../shared/styles.module.css";
import Main from "./main/Main";
import Sidebar from "./sidebar/Sidebar";
import utils, { store } from "./utils/utils";

// this folder should be as small as possible
// common functions should be extended from shared folder!

class BlackNWhite extends React.Component {
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

export default BlackNWhite;
