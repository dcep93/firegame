import { Resource } from "../utils/bank";
import utils, { PlayerType, store } from "../utils/utils";
import PowerPlant from "./PowerPlant";

export default function Players() {
  return (
    <div>
      {store.gameW.game.playerOrder
        .map((i) => ({ i, p: store.gameW.game.players[i] }))
        .map(({ p, i }) => (
          <div
            key={i}
            style={
              i === utils.myIndex()
                ? {
                    float: "right",
                    backgroundColor: "lightgrey",
                  }
                : {}
            }
          >
            <div
              style={{
                ...utils.bubbleStyle,
                backgroundColor: utils.getPlayerBackgroundColor(i),
              }}
            >
              <PlayerLabel p={p} />
              <div>
                {p.color} / ${p.money} / {(p.cityIndices || []).length} cities
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div>
                  {utils
                    .enumArray(Resource)
                    .filter((r) => p.resources[r] !== undefined)
                    .map((r) => (
                      <div
                        key={r}
                        onClick={() =>
                          i === utils.myIndex() && utils.dumpResource(true, r)
                        }
                      >
                        {p.resources[r]} {Resource[r]}
                      </div>
                    ))}
                </div>
                {(p.powerPlantIndices || []).map((pp, j) => (
                  <div key={j}>
                    <PowerPlant
                      pp={pp}
                      isHover={
                        i === utils.myIndex() && utils.dumpPowerPlant(false, j)
                      }
                      onClick={() =>
                        i === utils.myIndex() && utils.dumpPowerPlant(true, j)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export function PlayerLabel(props: { p: PlayerType }) {
  return (
    <div style={{ display: "flex" }}>
      <span
        style={{
          minWidth: "1em",
          backgroundColor: props.p.color,
          marginRight: "1em",
        }}
      ></span>
      <span>{props.p.userName}</span>
    </div>
  );
}
