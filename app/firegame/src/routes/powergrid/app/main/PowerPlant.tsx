import { powerplants, Resource } from "../utils/bank";
import utils, { store } from "../utils/utils";

export default function PowerPlant(props: {
  pp: number;
  isHover: boolean;
  onClick: () => void;
}) {
  return (
    <div
      style={{
        ...utils.bubbleStyle,
        cursor: props.isHover ? "pointer" : undefined,
        ...((store.gameW.game.powerplantIndices || [])[
          store.gameW.game.auction?.i || -1
        ] === props.pp
          ? {
              backgroundColor: "gray",
            }
          : {}),
      }}
      onClick={props.onClick}
    >
      <div>
        ${powerplants[props.pp].cost}(
        {store.gameW.game.historicalCosts?.[props.pp] || "*"})
      </div>
      <div>
        {Object.entries(powerplants[props.pp].resources).map(
          ([r, c]) => `${Resource[r as unknown as number]}:${c}`
        )}
      </div>
      <div style={{ float: "right" }}>-&gt; {powerplants[props.pp].power}</div>
    </div>
  );
}
