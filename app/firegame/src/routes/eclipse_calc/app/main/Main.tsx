import React from "react";
import utils, { store } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";
import { wordList } from "../../../spy/app/utils/utils";
import { ShipType } from "../utils/NewGame";
import Outcomes from "./Outcomes";

class Main extends React.Component {
  render() {
    // return null;
    const catalog = store.gameW.game.catalog || [];
    store.gameW.game.catalog = catalog;
    return (
      <div>
        <div className={styles.flex}>
          {store.gameW.game.fleets.map((f, fI) => (
            <div className={styles.bubble} key={fI} style={{ height: "100%" }}>
              <h2>
                {fI === 0
                  ? "defending forces of good"
                  : "attacking forces of evil"}
              </h2>
              <div>
                <select
                  value={0}
                  onChange={(e) =>
                    (({ targetValue }) =>
                      Promise.resolve()
                        .then(() =>
                          (store.gameW.game.catalog || []).find(
                            (of) => of.name === targetValue
                          )
                        )
                        .then((catalogShip) =>
                          catalogShip
                            ? Promise.resolve()
                                .then(() => f.push(catalogShip.name))
                                .then(() =>
                                  store.update(`added ${catalogShip.name}`)
                                )
                            : Promise.resolve()
                                .then(() => catalog.map((ca) => ca.name))
                                .then((existingNames) =>
                                  utils
                                    .randomFrom(
                                      wordList.filter(
                                        (w) => !existingNames.includes(w)
                                      )
                                    )
                                    .toUpperCase()
                                )
                                .then((name) =>
                                  Promise.resolve()
                                    .then(() =>
                                      catalog.push({
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
                                    .then(() => f.push(name))
                                    .then(() => store.update(`spawned ${name}`))
                                )
                        ))({
                      targetValue: e.target.value,
                    })
                  }
                >
                  <option value={"todo"}>revive ship</option>
                  <option value={"todo"}>revive ship</option>
                  {(store.gameW.game.catalog || [])
                    .filter((c) => f.find((ff) => ff === c.name) === undefined)
                    .map((c, i) => (
                      <option key={i}>{c.name}</option>
                    ))}
                </select>
              </div>
              <div>
                <div>
                  {f
                    .filter((name) => !(name as { null: true }).null)
                    .map((name) => catalog.find((c) => c.name === name))
                    .map((ship, shipI) => ({ ship: ship as ShipType, shipI }))
                    .map(({ ship, shipI }) => (
                      <div key={shipI}>
                        <div className={styles.bubble}>
                          <Ship ship={ship} />
                          <button
                            onClick={() =>
                              store.update(`deleted ${f.splice(shipI, 1)[0]!}`)
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
        <div>
          <Outcomes />
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
            <div key={valueKey} style={{ display: "flex" }}>
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
              ))}
              <div style={{ width: "1em" }}></div>
              <div
                style={{
                  display: "inline",
                  whiteSpace: "nowrap",
                }}
              >
                {value} / {valueKey}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Main;
