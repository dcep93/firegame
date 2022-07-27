import React from "react";
import { recorded_sha } from "../../../recorded_sha";
import styles from "../../../shared/styles.module.css";
import Shared from "../../shared";
import store from "../../store";
import Player from "./Player";
import SharedLog from "./SharedLog";

abstract class SharedSidebar<T> extends React.Component {
  abstract name: string;
  abstract NewGame: (params: T) => any;
  abstract getParams(): T;
  abstract isMyTurn: () => boolean;

  rules: string | null = null;

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
          {this.renderInfo()}
          <div className={styles.bubble}>
            <h2>
              <a href={".."}>Home</a>
            </h2>
          </div>
          <SharedLog />
        </div>
      </div>
    );
  }

  renderStartNewGame() {
    return (
      <div>
        <button onClick={this.startNewGame.bind(this)}>New Game</button>
        {this.rules && (
          <h4>
            <a href={this.rules}>Rules</a>
          </h4>
        )}
      </div>
    );
  }

  startNewGame() {
    Promise.resolve()
      .then(this.getParams.bind(this))
      .then(this.NewGame)
      .catch((e) => {
        alert(e);
        console.error(e);
      })
      .then((game) => game && store.update("started a new game", game));
  }

  componentDidMount() {
    this.maybeSyncParams();
  }

  componentDidUpdate() {
    this.maybeSyncParams();
  }

  maybeSyncParams(): void {
    document.title = (this.isMyTurn() ? "(!) " : "") + this.name;
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
      Shared.M(index);
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
