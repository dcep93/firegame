import React from "react";
import { SPECIES, SpeciesId } from "@eclipse/shared";
import type { RoomPlayer } from "@eclipse/shared";
import firegameStyles from "../../../shared/styles.module.css";
import store from "../../../shared/store";
import { ConnectionProvider } from "./context/ConnectionContext";
import { GameProvider } from "./context/GameContext";
import { GamePage } from "./pages/GamePage";
import {
  createFiregameEclipseGame,
  createFiregameEclipseSetupGame,
  selectFiregameEclipseSpecies,
  syncFiregameEclipseSetupGame,
} from "./firegame/session";
import {
  isFiregameEclipseGame,
  isFiregameEclipseSetupGame,
} from "./firegame/types";
import type {
  FiregameEclipseSetupGame,
  FiregameEclipseStoredGame,
} from "./firegame/types";
import "./styles/variables.css";
import "./styles/animations.css";
import "./styles/tech-tiles.css";

const ALL_SPECIES = Object.values(SpeciesId);

export default class Eclipse extends React.Component {
  startNewGame = () => {
    try {
      store.update(
        "started Eclipse setup",
        createFiregameEclipseSetupGame(store.lobby, store.me.userId),
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  selectSpecies = (setup: FiregameEclipseSetupGame, speciesId: SpeciesId) => {
    try {
      const next = selectFiregameEclipseSpecies(
        setup,
        store.lobby,
        store.me.userId,
        speciesId,
      );
      store.update(`selected ${SPECIES[speciesId]?.name ?? speciesId}`, next);
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  startGame = (setup: FiregameEclipseSetupGame) => {
    if (setup.hostUserId !== store.me.userId) {
      alert("Only the setup host can start the game.");
      return;
    }

    try {
      const synced = syncFiregameEclipseSetupGame(setup, store.lobby);
      store.update(
        "started Eclipse",
        createFiregameEclipseGame(store.lobby, store.me.userId, synced),
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  render() {
    const game = store.gameW?.game as FiregameEclipseStoredGame | null | undefined;
    if (!game) {
      return this.renderSetupShell(null);
    }

    if (isFiregameEclipseSetupGame(game)) {
      return this.renderSetupShell(syncFiregameEclipseSetupGame(game, store.lobby));
    }

    if (isFiregameEclipseGame(game)) return (
      <ConnectionProvider>
        <GameProvider>
          <GamePage />
        </GameProvider>
      </ConnectionProvider>
    );

    return this.renderSetupShell(null);
  }

  renderSetupShell(setup: FiregameEclipseSetupGame | null) {
    const players = setup?.players ?? [];
    const myPlayer = players.find((player) => player.playerId === store.me.userId);
    const isHost = Boolean(setup && setup.hostUserId === store.me.userId);
    const setupReady =
      Boolean(setup) &&
      players.length >= 2 &&
      players.length <= 6 &&
      players.every((player) => player.speciesId);
    const startDisabled =
      !setup ||
      !setupReady;

    return (
      <div className={firegameStyles.main}>
        <div className={firegameStyles.resizeable}>
          <div className={firegameStyles.sidebar}>
            <div className={firegameStyles.bubble}>
              <h2>Eclipse</h2>
              {!setup ? (
                <button onClick={this.startNewGame} data-demo="new-game">
                  New Game
                </button>
              ) : isHost ? (
                <>
                  <button
                    onClick={() => this.startGame(setup)}
                    disabled={startDisabled}
                    data-demo="new-game"
                  >
                    Start Game
                  </button>
                  <button onClick={this.startNewGame}>Reset Setup</button>
                </>
              ) : (
                <div>Waiting for host</div>
              )}
              <h2>
                <a href="..">Home</a>
              </h2>
            </div>
            <div className={firegameStyles.bubble}>
              <h2>Lobby</h2>
              {setup
                ? players.map((player) => this.renderPlayerRow(player, setup))
                : Object.entries(store.lobby).map(([userId, userName]) => (
                  <div key={userId}>{userName}</div>
                ))}
            </div>
          </div>
        </div>
        <div className={firegameStyles.content}>
          <div style={styles.setupPanel}>
            {!setup ? (
              <div className={firegameStyles.bubble}>
                Start a new Eclipse setup once 2-6 players are in the Firegame lobby.
              </div>
            ) : (
              <>
                <div className={firegameStyles.bubble}>
                  <h2>Choose Species</h2>
                  <div style={styles.speciesGrid}>
                    {ALL_SPECIES.map((speciesId) => {
                      const takenBy = players.find(
                        (player) =>
                          player.playerId !== store.me.userId &&
                          player.speciesId === speciesId,
                      );
                      const selected = myPlayer?.speciesId === speciesId;
                      return (
                        <button
                          key={speciesId}
                          onClick={() => this.selectSpecies(setup, speciesId)}
                          disabled={Boolean(takenBy) || !myPlayer}
                          style={speciesButtonStyle(speciesId, selected, Boolean(takenBy))}
                        >
                          <span style={speciesSwatchStyle(speciesId)} />
                          <span>{SPECIES[speciesId]?.name ?? speciesId}</span>
                          <span style={styles.speciesSubtitle}>
                            {takenBy
                              ? store.lobby[takenBy.playerId] ?? takenBy.nickname
                              : SPECIES[speciesId]?.subtitle}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                {!setupReady ? (
                  <div className={firegameStyles.bubble}>
                    Waiting for 2-6 players with unique species.
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  renderPlayerRow(player: RoomPlayer, setup: FiregameEclipseSetupGame) {
    const speciesId = player.speciesId;
    const isMe = player.playerId === store.me.userId;
    const name = store.lobby[player.playerId] ?? player.nickname;

    return (
      <div key={player.playerId} style={styles.playerRow}>
        <span>
          {name}
          {player.playerId === setup.hostUserId ? " (host)" : ""}
          {isMe ? " (you)" : ""}
        </span>
        <span style={styles.playerSpecies}>
          {speciesId ? (
            <>
              <span style={speciesSwatchStyle(speciesId)} />
              {SPECIES[speciesId]?.name ?? speciesId}
            </>
          ) : (
            "No species"
          )}
        </span>
      </div>
    );
  }
}

const styles: Record<string, React.CSSProperties> = {
  setupPanel: {
    alignContent: "flex-start",
    display: "flex",
    flexWrap: "wrap",
    gap: "0.25em",
    padding: "0.5em",
  },
  speciesGrid: {
    display: "grid",
    gap: "0.5em",
    gridTemplateColumns: "repeat(auto-fit, minmax(15em, 1fr))",
    minWidth: "min(44em, calc(100vw - 3em))",
  },
  speciesSubtitle: {
    color: "#555",
    display: "block",
    fontSize: "0.85em",
    gridColumn: "2",
    marginTop: "0.25em",
  },
  playerRow: {
    alignItems: "center",
    display: "flex",
    gap: "0.5em",
    justifyContent: "space-between",
    padding: "0.2em 0",
  },
  playerSpecies: {
    alignItems: "center",
    display: "inline-flex",
    gap: "0.35em",
    textAlign: "right",
  },
};

function speciesButtonStyle(
  speciesId: SpeciesId,
  selected: boolean,
  taken: boolean,
): React.CSSProperties {
  const species = SPECIES[speciesId];
  return {
    alignItems: "center",
    backgroundColor: selected ? "#e6f3ff" : taken ? "#eee" : "white",
    border: selected
      ? `3px solid ${species?.color ?? "black"}`
      : "2px solid black",
    borderRadius: "0.5em",
    color: taken ? "#777" : "black",
    cursor: taken ? "not-allowed" : "pointer",
    display: "grid",
    gridTemplateColumns: "1.2em 1fr",
    minHeight: "4.5em",
    padding: "0.7em",
    textAlign: "left",
  };
}

function speciesSwatchStyle(speciesId: SpeciesId): React.CSSProperties {
  const color = SPECIES[speciesId]?.color ?? "transparent";
  return {
    backgroundColor: color,
    border: color === "white" ? "1px solid #888" : "1px solid black",
    borderRadius: "50%",
    display: "inline-block",
    height: "0.9em",
    width: "0.9em",
  };
}
