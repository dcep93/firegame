import React from "react";
import { store } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";
import MapBuilder from "./MapBuilder";

class Main extends React.Component {
  render() {
    return (
      <div className={styles.bubble}>
        <h2>Main</h2>
        <pre>{JSON.stringify(store.gameW.game)}</pre>
        <MapBuilder name="germany" />
      </div>
    );
  }
}

export default Main;
