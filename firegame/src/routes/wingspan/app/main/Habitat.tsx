import React from "react";
import styles from "../../../../shared/styles.module.css";
import wStyles from "../index.module.css";
import { HabitatEnum } from "../utils/types";
import { store } from "../utils/utils";

class Habitat extends React.Component<{ habitat: HabitatEnum }> {
  render() {
    return (
      <div className={[styles.flex].join(" ")}>
        <span className={wStyles.habitat}>
          {HabitatEnum[this.props.habitat]}
        </span>
        <pre>{JSON.stringify(store.gameW.game)}</pre>
      </div>
    );
  }
}

export default Habitat;
