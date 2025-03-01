import React from "react";
import SharedSidebar from "../../../shared/components/sidebar/SharedSidebar";
import styles from "../../../shared/styles.module.css";
import Main from "./main/Main";
import utils, { store } from "./utils/utils";

export default class PowerGrid extends React.Component {
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
  name = "Power Grid";
  utils = utils;
  rules =
    "https://www.riograndegames.com/wp-content/uploads/2018/12/Power-Grid-Recharged-Rules.pdf";

  renderInfo(): JSX.Element | null {
    return (
      <h2>
        <a href="https://github.com/dcep93/firegame/blob/master/app/firegame/src/routes/powergrid/app/utils/bank.tsx">
          bank
        </a>
      </h2>
    );
  }
}
