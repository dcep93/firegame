import styles from "../../../../shared/styles.module.css";
import { Buildable } from "../utils/NewGame";
import utils from "../utils/utils";

export default function BuildSelector() {
  const d = utils.getTask().d!;
  if (d.buildData !== undefined) return null;
  const allChoices = {
    [Buildable.cavern_tunnel]: [[Buildable.cavern, Buildable.tunnel]],
    [Buildable.excavation]: [
      [Buildable.cavern, Buildable.cavern],
      [Buildable.cavern, Buildable.tunnel],
    ],
    [Buildable.fence_2]: [[Buildable.fence_2, Buildable.fence_2]],
    [Buildable.farm_tile]: [[Buildable.pasture, Buildable.field]],
    [Buildable.ore_mine_construction]: [
      [Buildable.ore_mine, Buildable.ore_tunnel],
    ],
  } as { [b in Buildable]?: [Buildable, Buildable][] };
  const choices = allChoices[d.build!];
  if (choices === undefined) return null;
  return (
    <div className={styles.bubble}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {choices
          .flatMap(([c1, c2]) =>
            c1 === c2
              ? [[c1, c2]]
              : [
                  [c1, c2],
                  [c2, c1],
                ]
          )
          .flatMap((cs) =>
            (["row", "column"] as ("row" | "column")[]).map(
              (flexDirection, rowColumn) => ({
                flexDirection,
                cs: cs as [Buildable, Buildable],
                rowColumn,
              })
            )
          )
          .map(({ cs, flexDirection, rowColumn }, i) => (
            <div
              key={i}
              style={{ border: 0, display: "flex", flexDirection }}
              className={styles.bubble}
            >
              {cs.map((c, tileIndex) => (
                <button
                  key={tileIndex}
                  style={{ height: "4em", width: "4em" }}
                  onClick={() =>
                    Promise.resolve()
                      .then(
                        () =>
                          (d.buildData = [cs[0], cs[1], rowColumn, tileIndex])
                      )
                      .then(() =>
                        utils.prepareNextTask(
                          `oriented: ${Buildable[d.build!]}`
                        )
                      )
                  }
                >
                  {Buildable[c]}
                </button>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}
