import utils, { Phase, store } from "../utils/utils";
import { PlayerLabel } from "./Players";
import PowerPlant from "./PowerPlant";

export default function Bank() {
  return (
    <div>
      <div style={utils.bubbleStyle}>
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
              defaultValue={store.gameW.game.auction.cost}
              max={utils.getCurrent()?.money}
              min={store.gameW.game.auction.cost + 1}
            />
            <input type={"submit"} value={"bid"} />
          </form>
        )}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {(store.gameW.game.deckIndices || [])
          .slice(0, store.gameW.game.step === 3 ? 7 : 8)
          .map((pp, i) => ({ pp, i }))
          .sort((a, b) => a.pp - b.pp)
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
