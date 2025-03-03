import utils, { store } from "../utils/utils";
import PowerPlant from "./PowerPlant";

export default function Bank() {
  return (
    <div>
      {(store.gameW.game.deckIndices || [])
        .slice(0, store.gameW.game.step === 3 ? 7 : 8)
        .map((pp, i) => ({ pp, i }))
        .sort((a, b) => a.pp - b.pp)
        .map(({ pp, i }, j) => (
          <div key={i}>
            <PowerPlant
              pp={pp}
              isHover={utils.buyPowerPlant(false, pp, i, j)}
              onClick={() => utils.buyPowerPlant(true, pp, i, j)}
            />
          </div>
        ))}
    </div>
  );
}
