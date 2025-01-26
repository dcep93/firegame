import React from "react";
import { store } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";
import { ShipType } from "../utils/NewGame";

class Main extends React.Component {
  render() {
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
                <button
                  onClick={() =>
                    Promise.resolve()
                      .then(() =>
                        f.push({
                          name: "",
                          count: 1,
                          hull: 0,
                          computer: 0,
                          shield: 0,
                          initiative: 1,
                          cannons: { "-1": 0 },
                          missiles: { "-1": 0 },
                        })
                      )
                      .then(() => store.update("spawned a new ship type"))
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
                                .then(() => store.update("deleted a ship type"))
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
        </div>
        <div>
          <Outcomes />
        </div>
        <div>
          <div className={styles.bubble}>
            <h2>raw_state.json</h2>
            <pre>{JSON.stringify(store.gameW.game, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }
}

function getOutcomes(): {
  winnerIndex: number;
  survivingShips: { [name: string]: number };
  probability: number;
  cumProb: number;
}[] {
  return [
    {
      winnerIndex: 0,
      survivingShips: {},
      probability: 0,
      cumProb: Math.random(),
    },
  ];
}

function Outcomes() {
  return (
    <div className={styles.bubble}>
      <h2>Outcomes</h2>
      <div>
        {getOutcomes().map((o, i) => (
          <div key={i}>
            <pre>{JSON.stringify(o, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

function Ship(props: { ship: ShipType }) {
  return <pre>{JSON.stringify(props.ship, null, 2)}</pre>;
}

export default Main;
