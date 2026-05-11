import React from "react";
import { firebaseUndo } from "../../../firegame/firebase";
import { recorded_sha } from "../../../recorded_sha";
import sharedStyles from "../../../shared/styles.module.css";
import styles from "./index.module.css";
import Main from "./main/Main";
import utils, { store } from "./utils/utils";

class FireTimer extends React.Component {
  render() {
    return (
      <div className={sharedStyles.main}>
        <Sidebar />
        <div className={[sharedStyles.content, styles.content].join(" ")}>
          {store.gameW.game ? <Main /> : <StartTimer />}
        </div>
      </div>
    );
  }
}

class Sidebar extends React.Component {
  render() {
    return (
      <div className={sharedStyles.resizeable}>
        <div className={sharedStyles.sidebar}>
          <div className={sharedStyles.bubble}>
            <h2 title={recorded_sha}>Fire Timer</h2>
            <StartButton />
            <div>
              <button
                onClick={() => firebaseUndo()}
                disabled={store.me?.userId !== store.gameW.info.playerId}
              >
                undo
              </button>
            </div>
            <h2>
              <a href={".."}>Home</a>
            </h2>
          </div>
        </div>
      </div>
    );
  }
}

class StartTimer extends React.Component {
  render() {
    return (
      <div className={styles.empty}>
        <StartButton />
      </div>
    );
  }
}

function StartButton() {
  return (
    <button className={styles.addButton} onClick={startTimer}>
      Start Timer
    </button>
  );
}

function startTimer() {
  Promise.resolve(utils.newGame()).then((game) =>
    store.update("started a new timer", game),
  );
}

export default FireTimer;
