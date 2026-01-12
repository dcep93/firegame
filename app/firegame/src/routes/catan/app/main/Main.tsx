import React from "react";
import { Tile } from "../utils/NewGame";
import { store } from "../utils/utils";
import css from "../index.module.css";

const resourceColors: Record<Tile["resource"], string> = {
  wood: "#7fb069",
  sheep: "#cbe896",
  wheat: "#f4d35e",
  brick: "#d1665a",
  ore: "#8d99ae",
  desert: "#d9c38f",
};

const rowLayout = [3, 4, 5, 4, 3];

function Main() {
  const game = store.gameW.game;
  let tileIndex = 0;

  return (
    <div className={css.wrapper}>
      <div className={css.settings}>
        Cities &amp; Knights:{" "}
        <strong>{game.params.citiesAndKnights ? "Enabled" : "Off"}</strong>
      </div>
      <div className={css.board}>
        {rowLayout.map((count, rowIndex) => {
          const tiles = game.tiles.slice(tileIndex, tileIndex + count);
          tileIndex += count;
          return (
            <div key={`row-${rowIndex}`} className={css.row}>
              {tiles.map((tile, index) => (
                <div
                  key={`tile-${rowIndex}-${index}`}
                  className={css.tile}
                  style={{ backgroundColor: resourceColors[tile.resource] }}
                >
                  <div className={css.tileResource}>{tile.resource}</div>
                  {tile.number !== undefined && (
                    <div className={css.tileNumber}>{tile.number}</div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Main;
