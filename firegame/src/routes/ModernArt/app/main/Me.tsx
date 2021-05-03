import React from "react";
import styles from "../../../../shared/styles.module.css";
import utils from "../utils/utils";
import ArtC from "./ArtC";

class Me extends React.Component {
  render() {
    const me = utils.getMe();
    return (
      <div className={styles.bubble}>
        <div>money: {me.money}</div>
        <div>
          {me.hand.map((a, i) => (
            <ArtC a={a} key={i} />
          ))}
        </div>
      </div>
    );
  }
}

export default Me;
