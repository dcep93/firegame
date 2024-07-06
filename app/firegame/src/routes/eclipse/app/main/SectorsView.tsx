import styles from "../../../../shared/styles.module.css";
import utils, { store } from "../utils/utils";

export default function SectorsView() {
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
  const radius = 10;
  return (
    <div className={styles.bubble}>
      <div
        style={{
          height: `${
            (((stats.y.max - stats.y.min + 2) * Math.sqrt(3)) / 2) * radius
          }em`,
          width: `${(stats.x.max - stats.x.min + 4 / 3) * 1.5 * radius}em`,
          position: "relative",
        }}
      >
        {game.sectors.map((sector) => (
          <div
            key={sector.tile}
            style={{
              position: "absolute",
              height: `${radius * 2}em`,
              width: `${radius * 2}em`,
              top: `${radius * ((sector.y + 1) * (Math.sqrt(3) / 2) - 1)}em`,
              left: `${sector.x * radius * 1.5}em`,
              backgroundColor: "#3498db",
              clipPath: `polygon(${utils
                .count(6)
                .map((i) => (i * 2 * Math.PI) / 6)
                .map(
                  (angle) =>
                    `${50 + 49.5 * Math.cos(angle)}% ${
                      50 + 49.5 * Math.sin(angle)
                    }%`
                )
                .join(", ")})`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
