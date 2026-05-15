import React from "react";
import firegameStyles from "../../../shared/styles.module.css";
import store from "../../../shared/store";
import { ConnectionProvider } from "./context/ConnectionContext";
import { GameProvider } from "./context/GameContext";
import { GamePage } from "./pages/GamePage";
import { createFiregameEclipseGame } from "./firegame/session";
import "./styles/variables.css";
import "./styles/animations.css";
import "./styles/tech-tiles.css";

export default class Eclipse extends React.Component {
  startNewGame = () => {
    try {
      store.update(
        "started Eclipse",
        createFiregameEclipseGame(store.lobby, store.me.userId),
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  render() {
    const game = store.gameW?.game;
    if (!game) {
      return (
        <div className={firegameStyles.main}>
          <div className={firegameStyles.resizeable}>
            <div className={firegameStyles.sidebar}>
              <div className={firegameStyles.bubble}>
                <h2>Eclipse</h2>
                <button onClick={this.startNewGame} data-demo="new-game">
                  New Game
                </button>
                <h2>
                  <a href="..">Home</a>
                </h2>
              </div>
              <div className={firegameStyles.bubble}>
                <h2>Lobby</h2>
                {Object.entries(store.lobby).map(([userId, userName]) => (
                  <div key={userId}>{userName}</div>
                ))}
              </div>
            </div>
          </div>
          <div className={firegameStyles.content}>
            <div className={firegameStyles.bubble}>
              Start a new Eclipse game once 2-6 players are in the Firegame lobby.
            </div>
          </div>
        </div>
      );
    }

    return (
      <ConnectionProvider>
        <GameProvider>
          <GamePage />
        </GameProvider>
      </ConnectionProvider>
    );
  }
}

