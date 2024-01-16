import styles from "../../../../shared/styles.module.css";
import Caverns, { Cavern } from "../utils/Caverns";
import {
  CaveTileType,
  FarmTileType,
  PlayerType,
  ResourcesType,
} from "../utils/NewGame";
import utils, { store } from "../utils/utils";

// click animal -> goes to slaughterhouse
// select square -> click animal -> goes to square

type SelectedPropsType = {
  selected: [number, number, number] | undefined;
  updateSelected: (s: [number, number, number] | undefined) => void;
};

export default function PlayersView(props: SelectedPropsType) {
  return (
    <div>
      {store.gameW.game.players
        .map(
          (_, i) =>
            store.gameW.game.players[
              (i + store.gameW.game.players.length - utils.myIndex()) %
                store.gameW.game.players.length
            ]
        )
        .map((p, i) => (
          <Player key={i} p={p} {...props} />
        ))}
    </div>
  );
}

function Player(
  props: {
    p: PlayerType;
  } & SelectedPropsType
) {
  const scoreDict = utils.getScoreDict(props.p);
  return (
    <div>
      <div
        className={[
          styles.bubble,
          utils.getCurrent().userId === props.p.userId && styles.blue,
        ].join(" ")}
      >
        <div style={{ position: "relative" }}>
          <h2>{props.p.userName}</h2>
          <h4 title={JSON.stringify(scoreDict, null, 2)}>
            score: {Object.values(scoreDict).sum()}
          </h4>
          <div
            className={styles.bubble}
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              backgroundColor: utils.getColor(props.p.index),
            }}
          ></div>
        </div>
        <div>
          ready dwarves:{" "}
          {(props.p.availableDwarves || []).map((d, i) => (
            <button
              key={i}
              disabled={!utils.payRubyOutOfOrder(props.p, i, false)}
              style={{
                padding: "0.5em",
              }}
              onClick={() => utils.payRubyOutOfOrder(props.p, i, true)}
            >
              {d}
            </button>
          ))}
        </div>
        {props.p.begging !== undefined && <div>begging: {props.p.begging}</div>}
        <div className={styles.bubble}>
          {(
            [
              "dogs",
              "sheep",
              "donkeys",
              "boars",
              "cows",
              "food",
              "stone",
              "wood",
              "ore",
              "rubies",
              "gold",
              "grain",
              "vegetables",
            ] as (keyof ResourcesType)[]
          )
            .map((resourceName) => ({
              resourceName,
              count: (props.p.resources || {})[resourceName] || 0,
            }))
            .filter(({ count }) => count > 0)
            .map(({ resourceName, count }, i) => (
              <div key={i}>
                <button
                  disabled={
                    !utils.doResource(
                      props.p,
                      props.selected,
                      resourceName,
                      false
                    )
                  }
                  onClick={() =>
                    utils.doResource(
                      props.p,
                      props.selected,
                      resourceName,
                      true
                    )
                  }
                >
                  {resourceName}: {count}
                </button>
              </div>
            ))}
        </div>
        <div>
          {props.p.userId !== utils.getMe().userId ? null : (
            <button
              disabled={!utils.slaughter(props.p, false)}
              onClick={() => utils.slaughter(props.p, true)}
            >
              slaughter
            </button>
          )}
        </div>
        <div style={{ display: "flex" }}>
          <Grid
            title={"farm"}
            selectedIndex={0}
            f={(t: FarmTileType, [i, j, k]) => (
              <div>
                <div>
                  {!t.isStable ? null : "stable"}
                  {t.doubleFenceAngleDeg !== undefined
                    ? t.doubleFenceAngleDeg
                    : t.isFence
                    ? "fence"
                    : t.resources !== undefined
                    ? null
                    : t.isPasture
                    ? "pasture"
                    : "field"}
                </div>
              </div>
            )}
            {...props}
          />
          <Grid
            title={"cave"}
            selectedIndex={1}
            f={(t: CaveTileType, [i, j, k]) => (
              <div>
                {t.tile !== undefined ? (
                  <button
                    title={Caverns[t.tile].title}
                    disabled={Caverns[t.tile!].action === undefined}
                    onClick={() =>
                      Caverns[t.tile!].action !== undefined &&
                      Caverns[t.tile!].action!(props.p)
                    }
                  >
                    (
                    {Caverns[t.tile].points !== undefined
                      ? Caverns[t.tile].points
                      : Caverns[t.tile].pointsF!(props.p)}
                    ) {Cavern[t.tile].replaceAll("_", "\n")}{" "}
                    {JSON.stringify(Caverns[t.tile!].supply)}
                  </button>
                ) : (
                  <div>
                    {t.isCavern
                      ? "CAVERN"
                      : t.isRubyMine
                      ? "RUBY_MINE"
                      : t.isRubyMine === false
                      ? "ORE_MINE"
                      : t.isOreTunnel
                      ? "ORE_TUNNEL"
                      : "TUNNEL"}
                  </div>
                )}
              </div>
            )}
            {...props}
          />
        </div>
      </div>
    </div>
  );
}

function Grid<T>(
  props: {
    p: PlayerType;
    title: string;
    selectedIndex: number;
    f: (t: T, coords: [number, number, number]) => JSX.Element | null;
  } & SelectedPropsType
) {
  return (
    <div className={styles.bubble}>
      <h4>{props.title}</h4>
      {utils.count(4).map((i) => (
        <div key={i} style={{ display: "flex" }}>
          {utils
            .count(3)
            .map((j) => ({
              t: (([props.p.farm || {}, props.p.cave][props.selectedIndex] ||
                {})[i] || {})[j],
              coords: [i, j, props.selectedIndex] as [number, number, number],
            }))
            .map(({ t, coords }) => (
              <div
                key={coords.join(".")}
                style={{
                  border: "2px solid black",
                  width: "8em",
                  height: "4em",
                  backgroundColor: !utils.objEqual(coords, props.selected)
                    ? undefined
                    : "lightgrey",
                  cursor: "pointer",
                }}
                onClick={() =>
                  utils.build(props.p, coords, true) ||
                  props.updateSelected(
                    utils.objEqual(coords, props.selected) ? undefined : coords
                  )
                }
              >
                {t === undefined ? null : props.f(t as T, coords)}
                {t?.resources === undefined
                  ? null
                  : Object.entries(t.resources).map(([resourceName, count]) => (
                      <button
                        key={resourceName}
                        onClick={() =>
                          Promise.resolve()
                            .then(() =>
                              utils.addResourcesToPlayer(
                                props.p,
                                {
                                  [resourceName]: 1,
                                },
                                true
                              )
                            )
                            .then(
                              () =>
                                (t.resources = utils.addResources(
                                  t.resources!,
                                  { [resourceName]: -1 }
                                ))
                            )
                            .then(() =>
                              utils.prepareNextTask(`moved up ${resourceName}`)
                            )
                        }
                      >
                        {resourceName}: {count}
                      </button>
                    ))}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
