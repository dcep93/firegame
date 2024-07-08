import styles from "../../../../shared/styles.module.css";
import { Resource, Sector, Ship } from "../utils/gameTypes";
import { Factions, Tiles, Token } from "../utils/library";
import utils from "../utils/utils";

export default function SectorView(props: { sector: Sector; radius: number }) {
  const { sector, radius } = props;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        height: `${radius * Math.sqrt(3)}em`,
        width: `${radius * 2}em`,
      }}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: Factions[sector.faction || ""]?.color || "lightgrey",
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
              onClick={() => utils.explorePortal(true, sector, orientation)}
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
          filter: "grayscale(100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ display: "inline-block" }}>
          <div>
            #{sector.tile} ({Tiles[sector.tile].points}){" "}
            {Tiles[sector.tile].artifact ? "★" : ""}
          </div>
          {!Tiles[sector.tile].warp_portal ? null : <div>warp_portal</div>}
          {(sector.tokens || [])
            .filter((t) => t !== Token.orbital)
            .map((t, i) => (
              <div key={i}>{Token[t]}</div>
            ))}
          {(sector.colonists || []).map((obj, i) => (
            <div key={i}>
              {obj.active ? "☑" : "□"}
              {obj.advanced ? "🔥 " : ""}
              {obj.resource === undefined
                ? "<synthesis>"
                : Resource[obj.resource]}{" "}
            </div>
          ))}
        </div>
        <div>
          {sector.faction === undefined ? (
            <div>
              {(sector.units || []).map((u, i) => (
                <div key={i}>
                  <div className={styles.bubble}>
                    {
                      {
                        [Ship.cruiser]: "guardian",
                        [Ship.interceptor]: "ancient",
                        [Ship.dreadnought]: "death_star",
                        [Ship.starbase]: "starbase",
                      }[u.ship]
                    }
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div>faction: {sector.faction}</div>
              {(sector.units || []).map((u, i) => (
                <div key={i}>
                  <div className={styles.bubble}>
                    {u.faction} {Ship[u.ship]}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
