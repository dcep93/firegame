import React from "react";

import { CommercialEnum, ScienceToken } from "../utils/types";
import utils, { store } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";

export const NUM_SCIENCES = 5;

class Science extends React.Component {
  render() {
    return (
      <div className={styles.bubble}>
        <h2>Sciences</h2>
        <div className={styles.flex}>
          {store.gameW.game.sciences
            .slice(0, NUM_SCIENCES)
            .filter((obj) => !obj.taken)
            .map((obj) => obj.token)
            .map(this.renderScience.bind(this))}
        </div>
      </div>
    );
  }

  renderScience(scienceToken: ScienceToken) {
    return (
      <div
        key={scienceToken}
        className={styles.bubble}
        title={scienceToken}
        onClick={() => this.select(scienceToken)}
      >
        {utils.enumName(scienceToken, ScienceToken)}
      </div>
    );
  }

  select(token: ScienceToken) {
    if (!utils.isMyCommercial(CommercialEnum.science)) return;
    utils.buildScienceToken(token);
  }
}

export default Science;
