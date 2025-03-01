import React from "react";
import { firebaseUndo } from "../../../firegame/firebase";
import { recorded_sha } from "../../../recorded_sha";
import styles from "../../../shared/styles.module.css";
import SharedUtils from "../../shared";
import store from "../../store";
import Player from "./Player";
import SharedLog from "./SharedLog";

abstract class SharedSidebar extends React.Component {
  abstract name: string;
  abstract utils: SharedUtils<any, any>;

  abstract rules: string;

  render() {
    return (
      <div className={styles.resizeable}>
        <div className={styles.sidebar}>
          <div className={styles.bubble}>
            <h2 title={recorded_sha}>{this.name}</h2>
            <div>{this.renderStartNewGame()}</div>
          </div>
          <div className={styles.bubble}>
            <h2 onClick={becomeHost}>Lobby</h2>
            {Object.entries(store.lobby).map(([userId, userName], index) => (
              <div key={index} onClick={() => become(userId)}>
                {<Player userId={userId} userName={userName} />}
              </div>
            ))}
          </div>
          <SharedLog />
        </div>
      </div>
    );
  }

  renderStartNewGame() {
    return (
      <div>
        <div>
          <button onClick={this.startNewGame.bind(this)}>New Game</button>
        </div>
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

        {this.rules !== "" && (
          <h2>
            <a href={this.rules}>Rules</a>
          </h2>
        )}
        {this.renderInfo()}
      </div>
    );
  }

  getParams(): any {
    return null;
  }

  startNewGame() {
    Promise.resolve()
      .then(this.getParams.bind(this))
      .then(this.utils.newGame)
      .catch((e) => {
        alert(e);
        console.error(e);
      })
      .then((game) => game && store.update("started a new game", game));
  }

  componentDidMount() {
    // @ts-ignore
    window.store = store;
    // @ts-ignore
    window.utils = this.utils;

    this.maybeSyncParams();
  }

  componentDidUpdate() {
    this.maybeSyncParams();
  }

  maybeSyncParams(): void {
    document.title = (this.utils.isMyTurn() ? "(!) " : "") + this.name;
  }

  renderInfo(): JSX.Element | null {
    return null;
  }
}

function become(userId: string) {
  if (store.gameW.info.host !== store.me.userId) return;
  const p = store.gameW.game.players;
  for (let index = 0; index < p.length; index++) {
    const uId = p[index].userId;
    if (uId === userId) {
      SharedUtils.M(index);
      return;
    }
  }
  alert("that player isnt in the game");
}

function becomeHost() {
  if (store.gameW.info.host === store.me.userId) {
    alert("You're already the host.");
    return;
  }
  const response = window.prompt("Enter the password to become the host.");
  if (!response) return;
  if (response !== "danrules") {
    window.open("https://www.youtube.com/watch?v=RfiQYRn7fBg");
    return;
  }
  store.gameW.info.host = store.me.userId;
  store.update("became the host");
}

export default SharedSidebar;
