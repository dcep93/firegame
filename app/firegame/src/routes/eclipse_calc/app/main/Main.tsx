import React from "react";
import utils, { store } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";
import { wordList } from "../../../spy/app/utils/utils";
import { ShipType } from "../utils/NewGame";
import Outcomes from "./Outcomes";

class Main extends React.Component {
  render() {
    return (
      <div>
        <div>
          <Outcomes />
        </div>
        <div className={styles.flex}>
          {store.gameW.game.fleets.map((f, fI) => (
            <div className={styles.bubble} key={fI} style={{ height: "100%" }}>
              <h2>
                {fI === 0
                  ? "defending forces of good"
                  : "attacking forces of evil"}
              </h2>
              <div>
                <button
                  onClick={() =>
                    Promise.resolve()
                      .then(() =>
                        store.gameW.game.fleets.flatMap((ff) =>
                          ff
                            .filter(
                              (ss) => !(ss as unknown as { null: boolean }).null
                            )
                            .map((ss) => (ss as ShipType).name)
                        )
                      )
                      .then((existingNames) =>
                        utils
                          .randomFrom(
                            wordList.filter((w) => !existingNames.includes(w))
                          )
                          .toUpperCase()
                      )
                      .then((name) =>
                        Promise.resolve()
                          .then(() =>
                            f.push({
                              name,
                              values: {
                                count: 1,
                                initiative: 1,
                                hull: 0,
                                computer: 0,
                                shield: 0,
                                cannons_1: 1,
                                cannons_2: 0,
                                cannons_3: 0,
                                cannons_4: 0,
                                missiles_1: 0,
                                missiles_2: 0,
                                missiles_3: 0,
                                missiles_4: 0,
                              },
                            })
                          )
                          .then(() => store.update(`spawned ${name}`))
                      )
                  }
                >
                  add ship
                </button>
              </div>
              <div>
                <div>
                  {f
                    .map((ship, shipI) => ({ ship: ship as ShipType, shipI }))
                    .filter(
                      ({ ship }) => !(ship as unknown as { null: boolean }).null
                    )
                    .map(({ ship, shipI }) => (
                      <div key={shipI}>
                        <div className={styles.bubble}>
                          <Ship ship={ship} />
                          <button
                            onClick={() =>
                              Promise.resolve()
                                .then(() => f.splice(shipI, 1))
                                .then(() =>
                                  store.update(`deleted ${ship.name}`)
                                )
                            }
                          >
                            delete ship
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
          <div className={styles.bubble} style={{ height: "100%" }}>
            <button
              onClick={() =>
                Promise.resolve()
                  .then(() => store.gameW.game.fleets.reverse())
                  .then(() => store.update("swapped fleets"))
              }
            >
              swap fleets
            </button>
          </div>
        </div>
        {/* <div>
          <div className={styles.bubble}>
            <h2>raw_state.json</h2>
            <pre>{JSON.stringify(store.gameW.game, null, 2)}</pre>
          </div>
        </div> */}
      </div>
    );
  }
}

function Ship(props: { ship: ShipType }) {
  return (
    <div>
      <div>name: {props.ship.name}</div>
      <div style={{ paddingLeft: "1em", fontFamily: "Courier New" }}>
        {Object.entries(props.ship.values)
          .sort()
          .map(([valueKey, value]) => ({
            valueKey,
            value,
            sortValue:
              { count: 1, initiative: 2, hull: 3, computer: 4, shield: 5 }[
                valueKey
              ] || 100,
          }))
          .sort((a, b) => a.sortValue - b.sortValue)
          .map(({ valueKey, value }) => (
            <div key={valueKey}>
              {Object.entries({ "-": -1, "+": 1 }).map(([k, v]) => (
                <button
                  key={k}
                  disabled={-v > value}
                  onClick={() =>
                    Promise.resolve()
                      .then(() => (props.ship.values[valueKey] += v))
                      .then(() =>
                        store.update(
                          `${props.ship.name}.${valueKey}.${value}.${k}`
                        )
                      )
                  }
                >
                  {k}
                </button>
              ))}{" "}
              {value} / {valueKey}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Main;
