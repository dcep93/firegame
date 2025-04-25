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
                  value={-1}
                  onChange={(e) =>
                    (({ targetValue }) =>
                      Promise.resolve().then(() =>
                        targetValue >= 0
                          ? Promise.resolve()
                              .then(() => f.push(targetValue))
                              .then(() =>
                                store.update(
                                  `added ${catalog[targetValue].name}`
                                )
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
                                  .then(() => f.push(catalog.length))
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
                                  .then(() => store.update(`spawned ${name}`))
                              )
                      ))({
                      targetValue: parseInt(e.target.value),
                    })
                  }
                >
                  <option value={"-1"}>add ship</option>
                  <option value={"-2"}>new ship</option>
                  {catalog
                    .map((c, i) => ({ c, i }))
                    .filter(({ i }) => !f.includes(i))
                    .map(({ c, i }) => (
                      <option key={i} value={i}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <div>
                  {f
                    .map((shipIndex, shipI) => ({
                      ship: store.gameW.game.catalog![shipIndex],
                      shipI,
                    }))
                    .filter(({ ship }) => ship)
                    .map(({ ship, shipI }) => (
                      <div key={shipI}>
                        <div className={styles.bubble}>
                          <Ship ship={ship} />
                          <button
                            onClick={() =>
                              store.update(
                                `deleted ${
                                  catalog[f.splice(shipI, 1)[0]!].name
                                }`
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
        <div>
          <Outcomes />
        </div>
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
