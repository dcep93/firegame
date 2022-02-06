import React from "react";
import Firebase from "../../../firegame/firebase";
import store from "../../store";
import { history } from "./SharedLog";

class Player extends React.Component<
  { userId: string; userName: string },
  { timesLength: number }
> {
  render() {
    if (
      !store.gameW.game?.players.find(
        (p: { userId: string }) => p.userId === this.props.userId
      )
    )
      return <>{this.props.userName}</>;

    const timeStrings = getTimes(this.props.userId)
      .filter((obj) => obj.id !== -1)
      .map((obj) => `${Math.floor(obj.duration)}s [${obj.id}]`);
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

function getTimes(userId: string) {
  const times = [];
  var previous = Firebase.now();
  const current =
    store.gameW.game.players[store.gameW.game.currentPlayer].userId;
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

class PlayerTimer extends React.Component<{
  userId: string;
  update: (timesLength: number) => void;
}> {
  interval: number = -1;
  componentDidMount() {
    this.interval = setInterval(this.forceUpdate.bind(this), 100);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const times = getTimes(this.props.userId);
    this.props.update(times.length);
    const totalTime = Math.floor(times.map((obj) => obj.duration).sum());
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
