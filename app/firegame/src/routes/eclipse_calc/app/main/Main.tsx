import React from "react";
import { store } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";
import Sidebar from "../sidebar/Sidebar";
import { ShipType } from "../utils/NewGame";
import Outcomes from "./Outcomes";

class Main extends React.Component {
  render() {
    if (!store.gameW.game) {
      setTimeout(() => new Sidebar({}).startNewGame());
      return null;
    }
    if (!store.gameW.game?.users) {
      store.gameW.game.users = {};
    }
    const game = store.gameW.game.users[store.me.userId];
    console.log(game);
    if (!game) {
      store.gameW.game.users[store.me.userId] = {
        catalog: Object.fromEntries(
          Object.entries({
            "JR NPC": {
              ancient: {
                initiative: 2,
                cannons_1: 2,
                hull: 1,
                computer: 1,
              },
              medium: {
                initiative: 3,
                cannons_1: 3,
                hull: 2,
                computer: 2,
              },
              death_star: {
                initiative: 0,
                cannons_1: 4,
                hull: 7,
                computer: 2,
              },
            },
            "SR NPC": {
              ancient: {
                initiative: 1,
                cannons_2: 1,
                hull: 2,
                computer: 1,
              },
              medium: {
                initiative: 1,
                missiles_2: 2,
                cannons_4: 1,
                hull: 3,
                computer: 1,
              },
              death_star: {
                initiative: 2,
                missiles_1: 4,
                cannons_4: 1,
                hull: 3,
                computer: 2,
              },
            },
          }).map(([color, d]) => [
            color,
            Object.entries(d).map(([size, values]) => ({
              color,
              size,
              values,
            })),
          ])
        ),
        fleets: [
          { color: "", sizes: null },
          { color: "", sizes: null },
        ],
      };
      setTimeout(() => store.update("joined"));
      return null;
    }
    return (
      <div>
        <div>
          <div className={styles.flex}>
            {game.fleets.map((f, fI) => (
              <div
                className={styles.bubble}
                key={fI}
                style={{ height: "100%" }}
              >
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
                          targetValue.length === 2
                            ? Promise.resolve().then(() => {
                                const size = parseInt(targetValue[1]);
                                if (f.color === targetValue[0] && f.sizes) {
                                  f.sizes.push(size);
                                } else {
                                  f.color = targetValue[0];
                                  f.sizes = [size];
                                }
                                store.update(`added ${size}`);
                              })
                            : Promise.resolve()
                                .then(() => prompt("enter new color name"))
                                .then((color) =>
                                  !color
                                    ? Promise.resolve()
                                    : Promise.resolve()
                                        .then(
                                          () =>
                                            (game.catalog[color] = [
                                              "interceptor",
                                              "cruiser",
                                              "dreadnought",
                                              "starbase",
                                            ].map((size) => ({
                                              color,
                                              size,
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
                                            })))
                                        )
                                        .then(() =>
                                          store.update(`defined ${color}`)
                                        )
                                )
                        ))({
                        targetValue: e.target.value.split("."),
                      })
                    }
                  >
                    <option value={"-1"}>add ship</option>
                    <option value={"-2"}>new color</option>
                    {Object.entries(game.catalog || {}).flatMap(
                      ([color, sizes]) =>
                        [{ size: "", sizeIndex: -1 }]
                          .concat(
                            sizes.map((ship, sizeIndex) => ({
                              size: ship.size,
                              sizeIndex,
                            }))
                          )
                          .map(({ size, sizeIndex }) => (
                            <option
                              key={`${color}.${size}`}
                              value={`${color}.${size}`}
                              disabled={
                                sizeIndex < 0 ||
                                (f.color === color &&
                                  f.sizes?.includes(sizeIndex))
                              }
                            >
                              {size === "" ? color : size}
                            </option>
                          ))
                    )}
                  </select>
                </div>
                <div>color: {f.color}</div>
                <div>
                  <div>
                    {(f.sizes || [])
                      .map((sizeIndex, shipI) => ({
                        ship: game.catalog[f.color][sizeIndex],
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
                                  `deleted ${f.sizes!.splice(shipI, 1)[0]!}`
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
                    .then(() => game.fleets.reverse())
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
      </div>
    );
  }
}

function Ship(props: { ship: ShipType }) {
  return (
    <div>
      <div>{props.ship.size}</div>
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
                          `${props.ship.size}.${valueKey}.${value}.${k}`
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
