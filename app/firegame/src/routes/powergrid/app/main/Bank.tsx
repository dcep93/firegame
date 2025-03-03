import utils, { store } from "../utils/utils";
import PowerPlant from "./PowerPlant";

export default function Bank() {
  return (
    <div>
      {store.gameW.game.auction === undefined ? null : (
        <div>
          <button onClick={() => utils.pass(true)}>pass</button>
          <form
            style={{ display: "inline", float: "right" }}
            onSubmit={(e) =>
              Promise.resolve(e.preventDefault()).then(() => {
                utils.bidOnPowerPlant(
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
              max={utils.getMe()?.money}
              min={store.gameW.game.auction.cost}
            />
            <input type={"submit"} value={"bid"} />
          </form>
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {(store.gameW.game.deckIndices || [])
          .slice(0, store.gameW.game.step === 3 ? 7 : 8)
          .map((pp, i) => ({ pp, i }))
          .sort((a, b) => a.pp - b.pp)
          .map(({ pp, i }, j) => (
            <div key={i}>
              <PowerPlant
                pp={pp}
                isHover={utils.auctionPowerPlant(false, pp, i, j)}
                onClick={() => utils.auctionPowerPlant(true, pp, i, j)}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
