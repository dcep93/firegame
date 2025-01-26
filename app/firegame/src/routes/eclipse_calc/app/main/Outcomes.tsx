import styles from "../../../../shared/styles.module.css";
import { ShipType } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

// todo antimatter_splitter

type OutcomeType = {
  survivingShips: { [name: string]: number };
  probability: number;
  fI: number;
  winner: string;
  cumProb: number;
};

type ShipGroupsType = {
  ship: ShipType;
  fI: number;
  damage: number;
}[][];

// todo
var initialized = false;

function getOutcomes(): OutcomeType[] {
  if (initialized) return [];
  initialized = true;
  const shipGroups = Object.entries(
    utils.groupByF(
      store.gameW.game.fleets.flatMap((f, fI) =>
        f
          .filter((ship) => !(ship as unknown as { null: boolean }).null)
          .map((ship) => ship as ShipType)
          .flatMap((ship) =>
            utils.repeat(
              {
                ship,
                damage: 0,
                shotMissiles: false,
                fI,
                sort: ship.values.initiative * 2 - fI,
              },
              ship.values.count
            )
          )
      ),
      (o) => o.sort.toString()
    )
  )
    .map(([sortStr, o]) => ({ sort: parseInt(sortStr), o }))
    .sort((a, b) => b.sort - a.sort)
    .map(({ o }) => o);
  const helped = getOutcomesHelper(true, 1, shipGroups.concat([[]]), {});
  const totalProbability = helped
    .map((o) => o.probability)
    .reduce((a, b) => a + b, 0);
  return helped
    .map((o) => ({ ...o, probability: o.probability / totalProbability }))
    .map((o) => ({
      ...o,
      sort:
        [-1, 1][o.fI] *
        Object.values(o.survivingShips)
          .map((c) => c as number)
          .reduce((a, b) => a + b, 0),
    }))
    .sort((a, b) => a.sort - b.sort)
    .reduce(
      (prev, { sort, ...curr }) =>
        prev.concat({
          ...curr,
          cumProb: (prev[prev.length - 1]?.cumProb || 0) + curr.probability,
        }),
      [] as OutcomeType[]
    );
}

function getOutcomesHelper(
  isMissiles: boolean,
  parentProbability: number,
  shipGroups: ShipGroupsType,
  cached: { [key: string]: OutcomeType[] }
): OutcomeType[] {
  const shipsByFi = utils.groupByF(
    shipGroups.flatMap((ss) => ss),
    (s) => s.fI.toString()
  );
  if (Object.keys(shipsByFi).length === 1) {
    return [
      ((fI) => ({
        fI,
        probability: 1,
        survivingShips: Object.fromEntries(
          Object.entries(
            utils.groupByF(Object.values(shipsByFi)[0], (s) => s.ship.name)
          ).map(([name, arr]) => [name, arr.length])
        ),
        cumProb: 0,
        winner: ["good", "evil"][fI],
      }))(parseInt(Object.keys(shipsByFi)[0])),
    ];
  }
  const key = JSON.stringify(shipGroups);
  if (cached[key]) {
    return cached[key];
  }
  cached[key] = [];
  const nextShipGroups = shipGroups.map((sg) => sg.map((o) => ({ ...o })));
  const shooter = nextShipGroups.shift()!;
  if (shooter.length === 0) {
    // end of missiles
    return getOutcomesHelper(false, parentProbability, nextShipGroups, cached);
  }
  nextShipGroups.push(shooter);
  return getPossibleChildren(isMissiles, nextShipGroups).flatMap(
    ({ childProbability, childShipGroups }) =>
      getOutcomesHelper(
        isMissiles,
        parentProbability * childProbability,
        childShipGroups,
        cached
      )
  );
}

function getPossibleChildren(
  isMissiles: boolean,
  shipGroups: ShipGroupsType
): {
  childProbability: number;
  childShipGroups: ShipGroupsType;
}[] {
  const shooter = shipGroups[shipGroups.length - 1];
  const dice = shooter.flatMap(({ ship }) =>
    Object.entries(ship.values)
      .map(([k, count]) => ({
        k,
        count,
      }))
      .filter(
        ({ k, count }) =>
          count && k.startsWith(isMissiles ? "missiles" : "cannons")
      )
      .map(({ k, count }) => ({
        value: parseInt(k.split("_")[1]),
        count,
        computer: ship.values.computer,
      }))
  );
  alert(JSON.stringify({ isMissiles, dice }));
  return [];
}

export default function Outcomes() {
  return (
    <div className={styles.bubble}>
      <h2>Outcomes</h2>
      <div>
        <div className={styles.flex}>
          {Object.values(utils.groupByF(getOutcomes(), (o) => o.winner)).map(
            (o, oI) => (
              <div key={oI} className={styles.bubble}>
                {o.map((oo, ooI) => (
                  <div key={ooI}>
                    <pre>{JSON.stringify(oo, null, 2)}</pre>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
