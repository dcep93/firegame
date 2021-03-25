import React from "react";
import store, { GameWrapperType } from "../../store";
import styles from "../../styles.module.css";
import LogEntry from "./LogEntry";

const history: GameWrapperType<any>[] = [];

abstract class Log<T> extends React.Component<
  {},
  { history: GameWrapperType<T>[] }
> {
  constructor(props: {}) {
    super(props);
    this.state = { history };
  }

  componentDidMount() {
    this.updateHistory();
  }

  componentDidUpdate() {
    this.updateHistory();
  }

  updateHistory() {
    const newState = store.gameW;
    if (
      !this.state.history[0] ||
      newState.info.id !== this.state.history[0].info.id
    ) {
      this.state.history.unshift(JSON.parse(JSON.stringify(newState)));
      const a = newState.info.alert;
      delete newState.info.alert;
      if (a) alert(a);
      window.location.href =
        "https://github.com/dcep93/firegame/blob/master/firegame/src/routes/war/app/utils/flip.tsx#L1";
      // trigger rerender
      this.setState({});
    }
  }

  render() {
    return (
      <div className={styles.bubble}>
        <h2>Log</h2>
        <div className={styles.dont_grow}>
          <div className={styles.log_entry_parent}>
            <div className={styles.inline}>
              {this.state.history.map((wrapper, index) => (
                <LogEntry
                  key={index}
                  wrapper={wrapper}
                  history={this.state.history}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Log;
