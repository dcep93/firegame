import styles from "../../../../shared/styles.module.css";
import { ShipType } from "../utils/NewGame";
import utils, { store } from "../utils/utils";
import { assignDamage } from "./assignDamage";

// todo antimatter_splitter

type OutcomeType = {
  survivingShips: { [name: string]: number };
  probability: number;
  fI: number;
  winner: string;
  cumProb: number;
};

export type ShipGroupsType = (
  | {
      ship: ShipType;
      fI: number;
      damage: number;
    }[]
  | null
)[];

type PRolls = {
  probability: number;
  rolls: { value: number; roll: number }[];
}[];

function getOutcomes(): OutcomeType[] {
  return [];
  const shipGroups: ShipGroupsType = Object.entries(
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
                fI,
                sortx: ship.values.initiative * 2 - fI,
              },
              ship.values.count
            )
          )
      ),
      (o) => o.sortx.toString()
    )
  )
    .map(([sortStr, o]) => ({ sorty: parseInt(sortStr), o }))
    .sort((a, b) => b.sorty - a.sorty)
    .map(({ o }) => o.map(({ sortx, ...oo }) => oo));
  const probabilities = Object.values(
    utils.groupByF(
      getProbabilities(true, 1, shipGroups.concat(null), {}, 0),
      (o) => JSON.stringify(o.survivingShips)
    )
  ).map((arr) => ({
    ...arr[0],
    probability: arr.map((a) => a.probability).reduce((a, b) => a + b, 0),
  }));
  return probabilities
    .map((o) => ({
      ...o,
      probability: parseFloat(o.probability.toFixed(4)),
      sortz:
        [-1, 1][o.fI] *
        Object.values(o.survivingShips)
          .map((c) => c as number)
          .reduce((a, b) => a + b, 0),
    }))
    .sort((a, b) => a.sortz - b.sortz)
    .reduce(
      (prev, { sortz, ...curr }) =>
        prev.concat({
          ...curr,
          cumProb: (prev[prev.length - 1]?.cumProb || 0) + curr.probability,
        }),
      [] as OutcomeType[]
    );
}

function getProbabilities(
  isMissiles: boolean,
  probability: number,
  shipGroups: ShipGroupsType,
  cached: { [key: string]: { t: string; v: OutcomeType[] } },
  depth: number
): OutcomeType[] {
  const shipsByFi = utils.groupByF(
    shipGroups.flatMap((ss) => ss || []),
    (s) => s.fI.toString()
  );
  const numFactions = Object.keys(shipsByFi).length;
  if (numFactions === 0) {
    return [];
  }
  if (numFactions === 1) {
    return [
      ((fI) => ({
        fI,
        probability,
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
    console.log({ isMissiles, shipGroups, c: cached[key] });
    return cached[key].v;
  }
  cached[key] = { t: "init", v: [] };
  const nextShipGroups = shipGroups.map((sg) =>
    sg === null ? null : sg.map((o) => ({ ...o }))
  );
  const shooter = nextShipGroups.shift();
  if (!shooter) {
    // end of missiles
    const cannonProbs = getProbabilities(
      false,
      probability,
      nextShipGroups,
      {},
      depth + 1
    );
    const totalProbability = cannonProbs
      .map((o) => o.probability)
      .reduce((a, b) => a + b, 0);
    return cannonProbs.map((o) => ({
      ...o,
      probability: o.probability / totalProbability,
    }));
  }
  nextShipGroups.push(shooter);
  console.log({
    depth,
    isMissiles,
    shooter,
    nextShipGroups,
  });
  const children = getChildren(isMissiles, nextShipGroups).flatMap(
    ({ childProbability, childShipGroups }) =>
      getProbabilities(
        isMissiles,
        childProbability,
        childShipGroups,
        cached,
        depth + 1
      )
  );
  console.log({ x: children.map((c) => c.probability).sum() });
  cached[key] = { t: "calc", v: children };
  return children.map((c) => ({
    ...c,
    probability: c.probability * probability,
  }));
}

// todo group
function getChildren(
  isMissiles: boolean,
  shipGroups: ShipGroupsType
): {
  childProbability: number;
  childShipGroups: ShipGroupsType;
}[] {
  const shooter = shipGroups[shipGroups.length - 1]!;
  const dice = Object.values(
    utils.groupByF(
      shooter.flatMap(({ ship }) =>
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
      ),
      (d) => JSON.stringify([d.computer, d.value])
    )
  ).map((arr) => ({
    ...arr[0],
    count: arr.map((d) => d.count).reduce((a, b) => a + b, 0),
  }));
  const pRolls = getPRolls(
    dice.map((o) => ({ ...o })),
    [{ probability: 1, rolls: [] }]
  );
  return pRolls.map((pr) => ({
    childProbability: pr.probability,
    childShipGroups: assignDamage(
      shooter[0].fI,
      shipGroups.map((sg) => (sg === null ? null : sg.map((o) => ({ ...o })))),
      pr.rolls
    )
      .map((sg) =>
        sg === null ? null : sg.filter((s) => s.damage < s.ship.values.hull + 1)
      )
      .filter((sg) => sg === null || sg.length > 0),
  }));
}

function getPRolls(
  dice: { count: number; value: number; computer: number }[],
  cross: PRolls
): PRolls {
  if (dice.length === 0) return cross;
  const dZero = dice[0];
  if (--dZero.count === 0) {
    dice.shift();
  }
  const possibleRolls = [5, Infinity];
  const rollProbs = Object.values(
    utils.groupByF(
      possibleRolls
        .map((roll) => roll + dZero.computer)
        .map((roll) => (roll >= 6 ? roll : 0)),
      (roll) => roll.toString()
    )
  ).map((arr) => ({
    roll: arr[0],
    probability: arr.length / possibleRolls.length,
  }));
  const nextCross = Object.values(
    utils.groupByF(
      rollProbs.flatMap((rp) =>
        cross.map((cp) => ({
          probability: cp.probability * rp.probability,
          rolls: cp.rolls
            .concat({ value: dZero.value, roll: rp.roll })
            .sort((a, b) => a.value - b.value)
            .sort((a, b) => a.roll - b.roll),
        }))
      ),
      (nc) => JSON.stringify(nc.rolls)
    )
  ).map((arr) => ({
    ...arr[0],
    probability: arr.map((a) => a.probability).reduce((a, b) => a + b, 0),
  }));
  return getPRolls(dice, nextCross);
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

const shipGroups = [
  [
    {
      ship: {
        name: "FROGS ",
        values: {
          cannons_1: 1,
          cannons_2: 0,
          cannons_3: 0,
          cannons_4: 0,
          computer: 0,
          count: 1,
          hull: 1,
          initiative: 0,
          missiles_1: 0,
          missiles_2: 0,
          missiles_3: 0,
          missiles_4: 0,
          shield: 0,
        },
      },
      damage: 0,
      fI: 1,
    },
  ],
  [
    {
      ship: {
        name: "BELIEF",
        values: {
          cannons_1: 0,
          cannons_2: 0,
          cannons_3: 0,
          cannons_4: 0,
          computer: 1,
          count: 1,
          hull: 0,
          initiative: 0,
          missiles_1: 1,
          missiles_2: 0,
          missiles_3: 0,
          missiles_4: 0,
          shield: 0,
        },
      },
      damage: 0,
      fI: 0,
    },
  ],
];

console.log(
  getProbabilities(false, 1, shipGroups, {}, 0)
    .map((p) => p.probability)
    .sum()
);
