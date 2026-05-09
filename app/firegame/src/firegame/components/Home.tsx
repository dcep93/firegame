import React from "react";
import { Link } from "react-router-dom";

import games from "../games";

import styles from "../../shared/styles.module.css";
import { firebaseClear } from "../firebase";

class Home extends React.Component {
  render() {
    return (
      <h2>
        {Object.keys(games).map(this.renderLink.bind(this))}
        <div className={styles.bubble}>
          <button onClick={clearFirebase}>Clear Firebase</button>
        </div>
      </h2>
    );
  }

  renderLink(gameName: string) {
    return (
      <div key={gameName} className={styles.bubble}>
        <Link to={`/${gameName}`}>{gameName.toLocaleUpperCase()}</Link>
      </div>
    );
  }
}

function clearFirebase() {
  const response = window.confirm("Clear all Firebase data for firegame?");
  if (!response) return;
  firebaseClear();
}

export default Home;
