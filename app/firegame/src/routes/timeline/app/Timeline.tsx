import React from "react";

import Main from "./main/Main";
import Sidebar from "./sidebar/Sidebar";
import { store, utils } from "./utils/utils";

import styles from "../../../shared/styles.module.css";

class Timeline extends React.Component {
  render() {
    // todo css help
    // sidebar and main should scroll on separate tracks
    return (
      <div className={`${utils.isMyTurn() && styles.my_turn}`}>
        <div className={styles.main}>
          <Sidebar />
          <div className={styles.content}>
            <div>{store.gameW.game && <Main />}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Timeline;
