import { Resource } from "../utils/bank";
import utils, { PlayerType, store } from "../utils/utils";
import PowerPlant from "./PowerPlant";

export default function Players() {
  return (
    <div>
      {store.gameW.game.playerOrder
        .map((i) => store.gameW.game.players[i])
        .map((p, i) => (
          <div
            key={i}
            style={
              p.userId !== store.me.userId
                ? {}
                : {
                    float: "right",
                    backgroundColor: "lightgrey",
                  }
            }
          >
            <div
              style={{
                ...utils.bubbleStyle,
                backgroundColor: utils.getPlayerBackgroundColor(p),
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
                      <div key={r} onClick={() => utils.dumpResource(true, r)}>
                        {p.resources[r]} {Resource[r]}
                      </div>
                    ))}
                </div>
                {(p.powerPlantIndices || []).map((pp, i) => (
                  <div key={i}>
                    <PowerPlant
                      pp={pp}
                      isHover={utils.sellPowerPlant(false, i)}
                      onClick={() => utils.sellPowerPlant(true, i)}
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
