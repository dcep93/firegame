import React from "react";
import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";
import { Art, Artist, AType } from "../utils/NewGame";
import utils from "../utils/utils";

class ArtC extends React.Component<{ a: Art; c?: string }> {
  render() {
    return (
      <div
        className={[
          styles.bubble,
          utils.countArt(this.props.a.artist) === 4 && styles.endable,
        ].join(" ")}
      >
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
