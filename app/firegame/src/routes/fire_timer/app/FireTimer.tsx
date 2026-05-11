import React from "react";
import SharedSidebar from "../../../shared/components/sidebar/SharedSidebar";
import sharedStyles from "../../../shared/styles.module.css";
import styles from "./index.module.css";
import Main from "./main/Main";
import utils, { store } from "./utils/utils";

class FireTimer extends React.Component {
  componentDidMount() {
    this.ensureGame();
  }

  componentDidUpdate() {
    this.ensureGame();
  }

  render() {
    return (
      <div className={sharedStyles.main}>
        <Sidebar />
        <div className={[sharedStyles.content, styles.content].join(" ")}>
          {store.gameW.game && <Main />}
        </div>
      </div>
    );
  }

  ensureGame() {
    if (store.gameW.game) return;
    Promise.resolve(utils.newGame()).then((game) => {
      if (!store.gameW.game) store.update("started a new timer", game);
    });
  }
}

class Sidebar extends SharedSidebar {
  name = "Fire Timer";
  utils = utils as any;
  rules = "";
}

export default FireTimer;
