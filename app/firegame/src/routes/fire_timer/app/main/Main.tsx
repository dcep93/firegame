import React from "react";
import styles from "../index.module.css";
import utils, { store, TurnType } from "../utils/utils";

class Main extends React.Component<{}, { now: number; playerName: string }> {
  intervalId?: ReturnType<typeof setInterval>;

  constructor(props: {}) {
    super(props);
    this.state = { now: utils.now(), playerName: "" };
  }

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState({ now: utils.now() });
    }, 250);
  }

  componentWillUnmount() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  render() {
    const game = store.gameW.game;
    const players = game.players || [];
    return (
      <div className={styles.timer}>
        <form className={styles.addPlayer} onSubmit={this.addPlayer}>
          <span>name:</span>
          <input
            value={this.state.playerName}
            onChange={(e) => this.setState({ playerName: e.target.value })}
          />
          <input
            type="submit"
            value="+"
            disabled={this.state.playerName.trim() === ""}
          />
        </form>
        <div className={styles.players}>
          {players.map((player) => {
            const isTicking = player.name === game.current_player_name;
            return (
              <div
                className={[
                  styles.player,
                  isTicking ? styles.ticking : "",
                ].join(" ")}
                key={player.name}
              >
                <button
                  className={styles.playerStart}
                  onClick={() => utils.startPlayer(player.name)}
                >
                  <span className={styles.name}>{player.name}</span>
                  <span className={styles.status}>
                    {isTicking ? "Current turn" : "Saved time"}
                  </span>
                  <span className={styles.time}>
                    {this.renderTime(player.name)}
                  </span>
                </button>
                <button
                  className={styles.deletePlayer}
                  onClick={() => utils.deletePlayer(player.name)}
                  title={`Delete ${player.name}`}
                >
                  x
                </button>
                {this.renderTurns(player.name, player.turns || [])}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  addPlayer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = this.state.playerName;
    utils.addPlayer(name);
    if (
      (store.gameW.game.players || []).some(
        (player) => player.name === name.trim(),
      )
    ) {
      this.setState({ playerName: "" });
    }
  };

  renderTime(playerName: string): string {
    const game = store.gameW.game;
    const player = (game.players || []).find(
      (player) => player.name === playerName,
    );
    if (!player) return "00:00";
    let total = player.time_used_previously_ms || 0;
    if (
      player.name === game.current_player_name &&
      game.current_player_start_timestamp > 0
    ) {
      total += this.state.now - game.current_player_start_timestamp;
    }
    return utils.formatDuration(total);
  }

  renderTurns(playerName: string, turns: TurnType[]): JSX.Element {
    return (
      <div className={styles.turns}>
        {turns.length === 0 ? (
          <div className={styles.noTurns}>no completed turns</div>
        ) : (
          turns.map((turn, index) => (
            <label
              className={[
                styles.turn,
                turn.counts_towards_total ? "" : styles.excludedTurn,
              ].join(" ")}
              key={`${turn.start_timestamp}:${turn.end_timestamp}:${index}`}
            >
              <input
                type="checkbox"
                checked={turn.counts_towards_total}
                onChange={() => utils.toggleTurn(playerName, index)}
              />
              <span className={styles.turnDuration}>
                {utils.formatDuration(turn.duration_ms)}
              </span>
              <span className={styles.turnTimestamp}>
                {this.formatTimestamp(turn.start_timestamp)} -{" "}
                {this.formatTimestamp(turn.end_timestamp)}
              </span>
            </label>
          ))
        )}
      </div>
    );
  }

  formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }
}

export default Main;
