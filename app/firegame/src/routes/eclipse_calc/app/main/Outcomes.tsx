import styles from "../../../../shared/styles.module.css";
import { ShipType } from "../utils/NewGame";
import utils, { store } from "../utils/utils";
import { assignDamage } from "./assignDamage";

// todo antimatter_splitter

const MIN_PROBABILITY = 1e-8;

type OutcomeType = {
  probability: number;
  survivingShips: { [name: string]: number };
  fI: number;
  winner: string;
  cumProb: number;
};

type PlaceholderType = {
  probability: number;
  placeholderKey: string;
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
  const shipInputs = store.gameW.game.fleets.map((f) =>
    f.map((shipIndex) => store.gameW.game.catalog![shipIndex]).filter(Boolean)
  );
  return getOutcomesHelper(shipInputs);
}

export function getOutcomesHelper(shipInputs: ShipType[][]): OutcomeType[] {
  const shipGroups: ShipGroupsType = Object.entries(
    utils.groupByF(
      shipInputs.flatMap((f, fI) =>
        f.flatMap((ship) =>
          utils.repeat(
            {
              ship,
              damage: 0,
              fI,
              sortx: (ship.values.initiative || 0) * 2 - fI,
            },
            ship.values.count || 1
          )
        )
      ),
      (o) => o.sortx.toString()
    )
  )
    .map(([sortStr, o]) => ({ sorty: parseInt(sortStr), o }))
    .sort((a, b) => b.sorty - a.sorty)
    .map(({ o }) => o.map(({ sortx, ...oo }) => oo));
  if (shipGroups.length < 2) return [];
  const rawProbs = getProbabilities(shipGroups.concat(null), null, 0);
  const probabilities = Object.values(
    utils.groupByF(
      rawProbs.map((p) => {
        if ((p as PlaceholderType).placeholderKey) {
          throw new Error("getOutcomesHelper.placeholderKey");
        }
        return p as OutcomeType;
      }),
      (o) => JSON.stringify(o.survivingShips)
    )
  ).map((arr) => ({
    ...arr[0],
    probability: arr.map((a) => a.probability).reduce((a, b) => a + b, 0),
  }));
  return (probabilities as OutcomeType[])
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
          cumProb: parseFloat(
            ((prev[prev.length - 1]?.cumProb || 0) + curr.probability).toFixed(
              6
            )
          ),
        }),
      [] as OutcomeType[]
    );
}

function getProbabilities(
  shipGroups: ShipGroupsType,
  cannonCache: { [key: string]: (OutcomeType | PlaceholderType)[] } | null,
  depth: number
): (OutcomeType | PlaceholderType)[] {
  if (depth > 10) return [];
  const flatShips = shipGroups.flatMap((ss) => (ss === null ? [] : ss));
  const shipsByFi = utils.groupByF(flatShips, (s) => s.fI.toString());
  const numFactions = Object.keys(shipsByFi).length;
  if (numFactions === 0) {
    throw new Error("getProbabilities.numFactions.zero");
  }
  const sourceKey = JSON.stringify(
    flatShips.map((fs) => ({ ...fs, ship: fs.ship.name }))
  );
  if (numFactions === 1) {
    return [
      ((fI) => ({
        sourceKey,
        probability: 1,
        fI,
        survivingShips: Object.fromEntries(
          Object.entries(
            utils.groupByF(Object.values(shipsByFi)[0], (s) => s.ship.name)
          )
            .map(([name, arr]) => [name, arr.length])
            .sort()
        ),
        cumProb: 0,
        winner: ["good", "evil"][fI],
      }))(parseInt(Object.keys(shipsByFi)[0])),
    ];
  }
  if (cannonCache) {
    const csk = cannonCache[sourceKey];
    if (csk) {
      return csk;
    }
    cannonCache[sourceKey] = [{ probability: 1, placeholderKey: sourceKey }];
  }
  const nextShipGroups = shipGroups.map((sg) =>
    sg === null ? null : sg.map((o) => ({ ...o }))
  );
  const shooter = nextShipGroups.shift();
  if (!shooter) {
    // end of missiles
    return getProbabilities(nextShipGroups, {}, depth + 1);
  }
  nextShipGroups.push(shooter);
  const children = getChildren(cannonCache === null, nextShipGroups);
  const childProbabilities = children
    .map((o) => ({
      ...o,
      sortX: o.childShipGroups
        .flatMap((sg) => sg || [])
        .map((sg) => sg.damage)
        .reduce((a, b) => a + b, 0),
    }))
    .sort((a, b) => b.sortX - a.sortX)
    .flatMap(({ childProbability, childShipGroups }) =>
      getProbabilities(childShipGroups, cannonCache, depth + 1).map(
        ({ probability, ...o }) => ({
          ...o,
          probability: probability * childProbability,
        })
      )
    )
    .filter((o) => o.probability >= MIN_PROBABILITY);
  if (!cannonCache) {
    return childProbabilities;
  }
  const recursiveChildren = childProbabilities
    .map((cpp) => cpp as PlaceholderType)
    .flatMap((cpp) =>
      cpp.placeholderKey
        ? cannonCache[cpp.placeholderKey].map((cccp) => ({
            ...cccp,
            probability: cccp.probability * cpp.probability,
          }))
        : [cpp]
    )
    .map((cpp) => cpp as PlaceholderType);
  cannonCache[sourceKey] = recursiveChildren;
  const groupedChildren = utils.groupByF(recursiveChildren, (cpp) =>
    (cpp.placeholderKey === sourceKey).toString()
  );
  const recursiveQuotient = (groupedChildren["true"] || [])
    .map((p) => p.probability)
    .reduce((a, b) => a + b, 0);
  const recursiveProbabilities = (groupedChildren["false"] || []).map(
    (cpp) => ({
      ...cpp,
      probability: cpp.probability / (1 - recursiveQuotient),
    })
  );
  cannonCache[sourceKey] = recursiveProbabilities;
  return recursiveProbabilities;
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
            computer: ship.values.computer || 0,
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
  const children = pRolls.map((pr) => ({
    childProbability: pr.probability,
    childShipGroups: assignDamage(
      shooter[0].fI,
      shipGroups.map((sg) => (sg === null ? null : sg.map((o) => ({ ...o })))),
      pr.rolls
    )
      .map((sg) =>
        sg === null
          ? null
          : sg.filter((s) => s.damage < (s.ship.values.hull || 0) + 1)
      )
      .filter((sg) => sg === null || sg.length > 0),
  }));
  return Object.values(
    utils.groupByF(children, (c) => JSON.stringify(c.childShipGroups))
  ).map((cs) => ({
    ...cs[0],
    childProbability: cs
      .map((c) => c.childProbability)
      .reduce((a, b) => a + b, 0),
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
  const possibleRolls = [-Infinity, 2, 3, 4, 5, Infinity];
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
                    <pre>
                      {Object.entries(oo)
                        .map(([k, v]) => ({
                          k,
                          v,
                        }))
                        .filter(({ k }) =>
                          ["survivingShips", "cumProb", "probability"].includes(
                            k
                          )
                        )
                        .map(({ k, v }) => `${k}: ${JSON.stringify(v)}`)
                        .join("\n")}
                    </pre>
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
