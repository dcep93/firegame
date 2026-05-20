import React from "react";
import Firebase from "../../../firegame/firebase";
import store from "../../store";
import { history } from "./SharedLog";

class Player extends React.Component<
  { userId: string; userName: string },
  { timesLength: number }
> {
  render() {
    if (!getGamePlayer(this.props.userId))
      return <>{this.props.userName}</>;

    const storedTime = getStoredTime(this.props.userId);
    const timeStrings =
      storedTime === null
        ? getTimes(this.props.userId)
            .filter((obj) => obj.id !== -1)
            .map((obj) => `${Math.floor(obj.duration)}s [${obj.id}]`)
        : [`${Math.floor(storedTime / 1000)}s stored in game state`];
    if (timeStrings.length === 0) timeStrings.push("-");

    return (
      <span title={timeStrings.join("\n")}>
        <PlayerTimer
          userId={this.props.userId}
          update={(timesLength: number) =>
            timesLength !== this.state?.timesLength &&
            this.setState({ timesLength })
          }
        />{" "}
        {this.props.userName}
      </span>
    );
  }
}

function getGamePlayer(userId: string) {
  return store.gameW.game?.players?.find(
    (p: { userId: string }) => p.userId === userId
  );
}

function getStoredTime(userId: string): number | null {
  const game = store.gameW.game;
  if (!game?.playerTimers) return null;
  let total = game.playerTimers[userId] || 0;
  const current = game.players?.[game.currentPlayer]?.userId;
  if (current === userId && game.phase !== "game_over" && typeof game.turnStartedAt === "number") {
    total += Math.max(0, Firebase.now() - game.turnStartedAt);
  }
  return total;
}

function getTimes(userId: string) {
  const times = [];
  var previous = Firebase.now();
  const current =
    store.gameW.game.players[store.gameW.game.currentPlayer]?.userId;
  if (current === userId)
    times.push({
      id: -1,
      duration: (previous - store.gameW.info.timestamp) / 1000,
    });
  for (let i = 0; i < history.length - 1; i++) {
    const wrapper = history[i];
    if (wrapper.info.isNewGame) break;
    previous = wrapper.info.timestamp;
    if (wrapper.info.playerId === userId)
      times.push({
        id: wrapper.info.id,
        duration: (previous - history[i + 1].info.timestamp) / 1000,
      });
  }
  return times;
}

export class PlayerTimer extends React.Component<{
  userId: string;
  update?: (timesLength: number) => void;
}> {
  interval: number = -1;
  componentDidMount() {
    this.interval = window.setInterval(this.forceUpdate.bind(this), 100);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const storedTime = getStoredTime(this.props.userId);
    const totalTime =
      storedTime === null
        ? Math.floor(getTimes(this.props.userId).map((obj) => obj.duration).sum())
        : Math.floor(storedTime / 1000);
    const seconds = totalTime % 60;
    const minutes = (totalTime - seconds) / 60;
    return (
      <>
        {minutes}:{seconds < 10 ? `0${seconds}` : `${seconds}`}
      </>
    );
  }
}

export default Player;
