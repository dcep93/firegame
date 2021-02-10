import React from "react";
import styles from "../../../../shared/styles.module.css";

class Main extends React.Component {
  render() {
    const height = window.innerHeight;
    return (
      <div style={{ display: "contents", height }}>
        <div className={styles.resizeable}>
          <div style={{ width: "50em", height }}>{this.renderLeft()}</div>
        </div>
        <div className={styles.resizeable}>
          <div style={{ width: "50em", height }}>{this.renderRight()}</div>
        </div>
      </div>
    );
  }

  renderLeft() {
    return <>a</>;
  }

  renderRight() {
    return <>b</>;
  }
}

export default Main;
