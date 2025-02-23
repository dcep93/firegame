import React from "react";
import SharedSidebar from "../../../shared/components/sidebar/SharedSidebar";
import styles from "../../../shared/styles.module.css";
import Main from "./main/Main";
import utils, { store } from "./utils/utils";

// this folder should be as small as possible
// common functions should be extended from shared folder!

export default class Template extends React.Component {
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

class Sidebar extends SharedSidebar {
  name = "Template";
  utils = utils;
  rules = "";
}
