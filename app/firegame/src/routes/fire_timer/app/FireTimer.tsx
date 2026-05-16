import React from "react";
import { firebaseUndo } from "../../../firegame/firebase";
import writer from "../../../firegame/writer/writer";
import { recorded_sha } from "../../../recorded_sha";
import SharedLog from "../../../shared/components/sidebar/SharedLog";
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
          {store.gameW.game && <Main />}
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
            <div>
              <button onClick={this.startNewGame}>New Game</button>
            </div>
            <div>
              <button
                onClick={() => firebaseUndo()}
                disabled={
                  process.env.NODE_ENV !== "development" &&
                  store.me?.userId !== store.gameW.info.playerId
                }
              >
                undo
              </button>
            </div>
            <div>
              <button
                onClick={() => writer.leaveLobby()}
                disabled={store.isSpectator || !store.lobby[store.me.userId]}
              >
                leave lobby
              </button>
            </div>
            <h2>
              <a href={".."}>Home</a>
            </h2>
          </div>
          <SharedLog />
        </div>
      </div>
    );
  }

  startNewGame = () => {
    Promise.resolve(utils.newGame()).then((game) =>
      store.update("started a new game", game),
    );
  };
}

export default FireTimer;
