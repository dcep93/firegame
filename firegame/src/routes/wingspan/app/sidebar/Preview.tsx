import React from "react";
import styles from "../../../../shared/styles.module.css";
import wStyles from "../index.module.css";
import { CardType } from "../utils/types";

var preview: Preview;

class Preview extends React.Component<{}, { card?: CardType }> {
  constructor(props: {}) {
    super(props);
    this.state = {};
    preview = this;
  }

  static setCard(card: CardType) {
    preview.setState({ card });
  }

  render() {
    if (this.state.card === undefined) return null;
    return (
      <div className={styles.bubble}>
        <h5>{this.state.card.name}</h5>
        <p>{this.state.card.scientific_name}</p>
        <img
          className={wStyles.previewImg}
          alt=""
          src={this.state.card.img}
        ></img>
      </div>
    );
  }
}

export default Preview;
