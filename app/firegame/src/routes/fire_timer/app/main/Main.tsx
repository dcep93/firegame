import React from "react";
import styles from "../index.module.css";
import utils, { store } from "../utils/utils";

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
          {game.players.map((player) => {
            const isTicking = player.name === game.current_player_name;
            return (
              <button
                className={[
                  styles.player,
                  isTicking ? styles.ticking : "",
                ].join(" ")}
                key={player.name}
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
      store.gameW.game.players.some((player) => player.name === name.trim())
    ) {
      this.setState({ playerName: "" });
    }
  };

  renderTime(playerName: string): string {
    const game = store.gameW.game;
    const player = game.players.find((player) => player.name === playerName);
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
}

export default Main;
