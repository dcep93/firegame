import styles from "../../../../shared/styles.module.css";
import { Tiles } from "../utils/library";
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
  const radius = 8;
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
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              height: `${radius * Math.sqrt(3)}em`,
              width: `${radius * 2}em`,
              bottom: `${
                (radius * (sector.y - stats.y.min) * Math.sqrt(3)) / 2
              }em`,
              left: `${radius * (sector.x - stats.x.min) * 1.5}em`,
            }}
          >
            <div
              style={{
                height: "100%",
                width: "100%",
                backgroundColor: "#3498db",
                clipPath: `polygon(${utils
                  .count(6)
                  .map((i) => (i * 2 * Math.PI) / 6)
                  .map(
                    (angle) =>
                      `${50 + 49.5 * Math.cos(angle)}% ${
                        50 + (49.5 * Math.sin(angle) * 2) / Math.sqrt(3)
                      }%`
                  )
                  .join(", ")})`,
              }}
            ></div>
            {Tiles[sector.tile].portals
              .map((portal) => portal + sector.orientation)
              .map((orientation) => (
                <div
                  key={orientation}
                  style={{
                    position: "absolute",
                    height: "50%",
                    top: 0,
                    transform: `rotate(${60 * orientation}deg)`,
                    transformOrigin: "bottom center",
                  }}
                >
                  <div
                    onClick={() =>
                      utils.explorePortal(true, sector, orientation)
                    }
                    style={{
                      cursor:
                        true || utils.explorePortal(false, sector, orientation)
                          ? "pointer"
                          : undefined,
                    }}
                  >
                    {"o"}
                  </div>
                </div>
              ))}
            <div
              style={{
                position: "absolute",
              }}
            >
              <div>
                {sector.tile}x{sector.x}y{sector.y}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
