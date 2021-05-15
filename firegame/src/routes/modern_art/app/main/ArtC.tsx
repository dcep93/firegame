import React from "react";
import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";
import { Art, Artist, AType } from "../utils/NewGame";

class ArtC extends React.Component<{ a: Art; c?: string }> {
  render() {
    return (
      <div className={styles.bubble}>
        <div>
          {Artist[this.props.a.artist]} - {AType[this.props.a.aType]}
        </div>
        <img
          className={this.props.c || css.artc}
          src={this.props.a.src}
          alt={""}
        />
      </div>
    );
  }
}

export default ArtC;
