import { powerplants, recharges } from "../utils/bank";
import utils, { Phase, store } from "../utils/utils";
import { PlayerLabel } from "./Players";
import PowerPlant from "./PowerPlant";

export default function Bank() {
  return (
    <div>
      <div
        title={((r) => r && utils.getResourceString(r).replaceAll(",", "\n"))(
          recharges[store.gameW.game.players.length]?.[store.gameW.game.step]
        )}
        style={{
          ...utils.bubbleStyle,
          ...(utils.isOver() ? { backgroundColor: "grey" } : {}),
        }}
        onClick={() => {
          utils.debugSwap();
          store.update("[debug] swapped");
        }}
      >
        <PlayerLabel p={utils.getCurrent()} />
        <div>{Phase[store.gameW.game.phase]}</div>
      </div>
      <div>
        <button onClick={() => utils.pass(true)}>pass</button>
        {store.gameW.game.auction === undefined ? null : (
          <form
            style={{ display: "inline", float: "right" }}
            onSubmit={(e) =>
              Promise.resolve(e.preventDefault()).then(() => {
                utils.bidOnPowerPlant(
                  true,
                  parseInt(
                    new FormData(e.target as HTMLFormElement).get(
                      "bid"
                    ) as string
                  )
                );
              })
            }
          >
            <input
              name={"bid"}
              style={{ width: "3em" }}
              type={"number"}
              defaultValue={store.gameW.game.auction.cost + 1}
              max={utils.getCurrent()?.money}
              min={store.gameW.game.auction.cost + 1}
            />
            <input type={"submit"} value={"bid"} />
          </form>
        )}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {(store.gameW.game.powerplantIndices || [])
          .slice(0, store.gameW.game.step === 3 ? 7 : 8)
          .map((pp, i) => ({
            pp,
            i,
            sort: pp === -1 ? Number.POSITIVE_INFINITY : powerplants[pp].cost,
          }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ pp, i }, j) => (
            <div key={i}>
              {pp === -1 ? (
                <div style={utils.bubbleStyle}>
                  <div>STEP 3</div>
                </div>
              ) : (
                <PowerPlant
                  pp={pp}
                  isHover={utils.auctionPowerPlant(false, pp, i, j)}
                  onClick={() => utils.auctionPowerPlant(true, pp, i, j)}
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
