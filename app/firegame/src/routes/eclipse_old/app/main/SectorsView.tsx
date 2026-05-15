import styles from "../../../../shared/styles.module.css";
import { Rank } from "../utils/gameTypes";
import utils, { store } from "../utils/utils";
import SectorView from "./SectorView";

export default function SectorsView(props: {
  updateSectorIndex: (sectorIndex: number) => void;
}) {
  const game = store.gameW.game;
  const stats = Object.fromEntries(
    (["x", "y"] as ("x" | "y")[])
      .map((sectorKey) => ({
        sectorKey,
        values: game.sectors.map((sector) => sector[sectorKey]),
      }))
      .map(({ sectorKey, values }) => [
        sectorKey,
        { max: Math.max(...values), min: Math.min(...values) },
      ])
  );
  const radius = 12;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      <div className={styles.bubble}>
        <div
          style={{
            height: `${
              (((stats.y.max - stats.y.min + 2) * Math.sqrt(3)) / 2) * radius
            }em`,
            width: `${(stats.x.max - stats.x.min + 4 / 3) * 1.5 * radius}em`,
            position: "relative",
            fontSize: "x-small",
          }}
        >
          {game.sectors.map((sector) => (
            <div
              key={sector.tile}
              style={{
                position: "absolute",
                top: `${
                  (radius * (stats.y.max - sector.y) * Math.sqrt(3)) / 2
                }em`,
                left: `${radius * (sector.x - stats.x.min) * 1.5}em`,
              }}
            >
              <SectorView sector={sector} radius={radius} />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.bubble}>
        <h5>remaining tiles:</h5>
        {utils
          .enumArray(Rank)
          .filter((r) => r !== Rank.special)
          .map((r) => (
            <div key={r}>
              {Rank[r]}: {(game.tiles[r] || []).length}
            </div>
          ))}
      </div>
    </div>
  );
}
