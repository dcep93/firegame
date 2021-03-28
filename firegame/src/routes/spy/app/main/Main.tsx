import React from "react";
import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";
import utils, { store } from "../utils/utils";

var alerted: string | null = null;

class Main extends React.Component<{}, { hidden: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = { hidden: false };
  }

  render() {
    const me = utils.getMe();
    if (me && alerted !== me.word) {
      alerted = me.word;
      alert(me.word);
    }
    return (
      <div className={styles.bubble}>
        <div>
          <h2>Bank</h2>
          <div>
            <div className={[styles.inline_flex, css.bank].join(" ")}>
              {store.gameW.game.bank.map((w) => (
                <p key={w} className={styles.bubble}>
                  {w}
                </p>
              ))}
            </div>
          </div>
        </div>
        {me && (
          <div
            className={[styles.bubble, css.my_word].join(" ")}
            onClick={() => this.setState({ hidden: !this.state.hidden })}
          >
            <div hidden={this.state.hidden}>{me.word}</div>
          </div>
        )}
      </div>
    );
  }
}

export default Main;
