import styles from "../../../../shared/styles.module.css";
import { ShipType } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

type OutcomeType = {
  survivingShips: { [name: string]: number };
  probability: number;
};

function getOutcomes(): (OutcomeType & {
  winner: string;
  cumProb: number;
})[] {
  const shipGroups = Object.entries(
    utils.groupByF(
      store.gameW.game.fleets.flatMap((f, fI) =>
        f
          .filter((ship) => !(ship as unknown as { null: boolean }).null)
          .map((ship) => ship as ShipType)
          .flatMap((ship) =>
            utils.repeat(
              { ship, damage: 0, fI, sort: ship.values.initiative * 2 - fI },
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
  const cached: { [key: string]: OutcomeType } = {};
  const helped = getOutcomesHelper(shipGroups, cached);
  const totalProbability = helped
    .map((o) => o.probability)
    .reduce((a, b) => a + b, 0);
  return helped
    .map((o) => ({ ...o, probability: o.probability / totalProbability }))
    .map(({ fI, ...o }) => ({
      ...o,
      winner: ["good", "evil"][fI],
      sort:
        [-1, 1][fI] *
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
      [] as (OutcomeType & { cumProb: number; winner: string })[]
    );
}

function getOutcomesHelper(
  shipGroups: {
    ship: ShipType;
    damage: number;
    fI: number;
    sort: number;
  }[][],
  cached: { [key: string]: OutcomeType }
): (OutcomeType & { fI: number })[] {
  return [
    {
      fI: 1,
      survivingShips: { gotem: 1 },
      probability: 1,
    },
    {
      fI: 1,
      survivingShips: { gotem: 1 },
      probability: 1,
    },
    {
      fI: 0,
      survivingShips: { gotem: 2 },
      probability: 1,
    },
  ];
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
