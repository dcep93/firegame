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
    preview && preview.setState({ card });
  }

  render() {
    if (this.state.card === undefined) return null;
    const file_name = this.state.card.scientific_name
      .toLowerCase()
      .replace(" ", "_");
    const src = `https://raw.githubusercontent.com/dcep93/firegame/master/app/firegame/src/routes/wingspan/assets/img/${file_name}.jpg`;
    return (
      <div className={styles.bubble}>
        <h5>{this.state.card.name}</h5>
        <p>{this.state.card.scientific_name}</p>
        <img
          key={this.state.card.id}
          className={wStyles.previewImg}
          alt=""
          // dont tell anyone I did this
          src={src}
        ></img>
      </div>
    );
  }
}

export default Preview;
