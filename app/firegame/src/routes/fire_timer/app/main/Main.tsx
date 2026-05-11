import React from "react";
import styles from "../index.module.css";
import utils, { store } from "../utils/utils";

class Main extends React.Component<{}, { now: number }> {
  intervalId?: ReturnType<typeof setInterval>;

  constructor(props: {}) {
    super(props);
    this.state = { now: utils.now() };
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
    const tickingIndex = utils.getTickingPlayerIndex(game);
    return (
      <div className={styles.timer}>
        <button className={styles.addButton} onClick={this.addPlayer}>
          Add Player
        </button>
        <div className={styles.players}>
          {game.players.map((player, index) => {
            const isTicking = index === tickingIndex;
            return (
              <button
                className={[
                  styles.player,
                  isTicking ? styles.ticking : "",
                ].join(" ")}
                key={player.name}
                onClick={() => utils.startPlayer(index)}
              >
                <span className={styles.name}>{player.name}</span>
                <span className={styles.status}>
                  {isTicking ? "Current turn" : "Last finished"}
                </span>
                <span className={styles.time}>
                  {this.renderTime(index, tickingIndex)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  addPlayer = () => {
    const name = window.prompt("Player name");
    if (name === null) return;
    utils.addPlayer(name);
  };

  renderTime(index: number, tickingIndex: number): string {
    const game = store.gameW.game;
    if (game.players.length === 0) return "00:00";
    if (index === tickingIndex) {
      const previous =
        game.players[(index + game.players.length - 1) % game.players.length];
      return utils.formatDuration(this.state.now - previous.turn_finished);
    }
    return new Date(game.players[index].turn_finished).toLocaleTimeString();
  }
}

export default Main;
