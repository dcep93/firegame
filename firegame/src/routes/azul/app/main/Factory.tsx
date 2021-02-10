import React from "react";
import styles from "../../../../shared/styles.module.css";
import { Tile } from "../utils/NewGame";
import utils from "../utils/utils";

class Factory extends React.Component<{
  index: number;
  tiles: Tile[];
  popDestination: () => number;
}> {
  render() {
    const factoryName = `Factory ${this.props.index + 1}`;
    return (
      <div>
        <div className={styles.bubble}>
          <div>{factoryName}</div>
          {this.props.tiles.map((tile, index) => (
            <div
              className={styles.bubble}
              key={index}
              style={{ backgroundColor: Tile[tile] }}
              onClick={() =>
                utils.takeTile(
                  factoryName,
                  tile,
                  false,
                  this.props.popDestination
                )
              }
            ></div>
          ))}
        </div>
      </div>
    );
  }
}

export default Factory;
