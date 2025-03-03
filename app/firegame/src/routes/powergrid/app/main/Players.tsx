import { Resource } from "../utils/bank";
import utils, { store } from "../utils/utils";

export default function Players() {
  return (
    <div>
      {store.gameW.game.playerOrder
        .map((i) => ({
          i,
          order:
            i < utils.myIndex() ? i + store.gameW.game.playerOrder.length : i,
        }))
        .sort((a, b) => a.order - b.order)
        .map(({ i }) => store.gameW.game.players[i])
        .map((p, i) => (
          <div key={i}>
            <div
              style={{
                ...utils.bubbleStyle,
                backgroundColor:
                  p.userId === store.me.userId ? "lightgrey" : undefined,
              }}
            >
              <div style={{ display: "flex" }}>
                <span
                  style={{
                    minWidth: "1em",
                    backgroundColor: "red",
                    marginRight: "1em",
                  }}
                ></span>
                <span>{p.userName}</span>
              </div>
              <div>
                {p.color} / ${p.money} / {(p.cityIndices || []).length} cities
              </div>
              <div>
                {utils
                  .enumArray(Resource)
                  .filter((r) => p.resources[r] !== undefined)
                  .map((r) => (
                    <div key={r}>
                      {p.resources[r]} {Resource[r]}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
