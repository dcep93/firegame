import React from "react";
import styles from "../../../shared/styles.module.css";
import Main from "./main/Main";
import Sidebar from "./sidebar/Sidebar";
import { store } from "./utils/utils";

class Spy extends React.Component {
  render() {
    return (
      <div>
        <div className={styles.content}>{store.gameW.game && <Main />}</div>
        <Sidebar />
      </div>
    );
  }
}

export default Spy;
