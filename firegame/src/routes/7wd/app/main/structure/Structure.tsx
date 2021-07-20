import React from "react";
import styles from "../../../../../shared/styles.module.css";
import css from "../../index.module.css";
import { store } from "../../utils/utils";
import StructureCard from "./StructureCard";

class Structure extends React.Component<{
  selectCard: (x: number, y: number, offset: number) => void;
}> {
  render() {
    return (
      <div className={styles.bubble}>
        <h2>Structure</h2>
        {store.gameW.game.structure &&
          store.gameW.game.structure.map((row, y) => (
            <div
              key={y}
              className={`${css.structure_row} ${
                y === 0 && css.structure_first_row
              }`}
            >
              {Object.entries(row).map(([offset, card], x) => (
                <StructureCard
                  key={x}
                  selectCard={this.props.selectCard}
                  y={y}
                  x={x}
                  // offset={offset}
                  {...card}
                />
              ))}
            </div>
          ))}
      </div>
    );
  }
}

export default Structure;
