import { incomes, Resource } from "../utils/bank";
import utils, { store } from "../utils/utils";

export default function ResourceBank() {
  return (
    <div
      style={{ ...utils.bubbleStyle }}
      title={JSON.stringify(incomes, null, 2)}
    >
      <div>ResourceBank</div>
      {utils
        .enumArray(Resource)
        .map((r) => ({ r, c: store.gameW.game.resources[r] }))
        .filter(({ c }) => c !== undefined)
        .map(({ r, c }) => (
          <div
            key={r}
            style={{
              cursor: utils.buyResource(false, r) ? "pointer" : undefined,
            }}
            onClick={() => utils.buyResource(true, r)}
          >
            ${utils.getResourceCost(r)}({c}) {Resource[r]}
          </div>
        ))}
    </div>
  );
}
