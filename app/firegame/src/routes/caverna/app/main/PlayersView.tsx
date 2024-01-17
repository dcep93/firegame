import styles from "../../../../shared/styles.module.css";
import Caverns, { Cavern } from "../utils/Caverns";
import {
  CaveTileType,
  FarmTileType,
  PlayerType,
  ResourcesType,
  Task,
} from "../utils/NewGame";
import utils, { store } from "../utils/utils";

type PlayersPropsType = {
  selected: [number, number, number] | undefined;
  updateSelected: (s: [number, number, number] | undefined) => void;
};

type ExtraPropsType<T> = PlayersPropsType & {
  p: PlayerType;
  f: (t: T, coords: [number, number, number]) => JSX.Element | null;
};

export default function PlayersView(props: PlayersPropsType) {
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
  props: PlayersPropsType & {
    p: PlayerType;
  }
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
        <div style={{ display: "flex" }}>
          <Grid
            title={"farm"}
            selectedIndex={0}
            f={(t: FarmTileType, [i, j, k]) => (
              <div>
                <div>
                  {t.isDoubleFence
                    ? "double_fence"
                    : t.isFence
                    ? "fence"
                    : t.isFence === false
                    ? "backup_fence"
                    : t.resources !== undefined
                    ? null
                    : t.isPasture
                    ? "pasture"
                    : "field"}
                </div>
                <div>{!t.isStable ? null : "stable"}</div>
              </div>
            )}
            {...props}
          />
          <Grid
            title={"cave"}
            selectedIndex={1}
            f={(t: CaveTileType, [i, j, k]) => (
              <div>
                {t.cavern !== undefined ? (
                  <button
                    style={{ width: "100%" }}
                    title={Caverns[t.cavern].title}
                    disabled={Caverns[t.cavern!].action === undefined}
                    onClick={() =>
                      Caverns[t.cavern!].action !== undefined &&
                      Caverns[t.cavern!].action!(props.p)
                    }
                  >
                    (
                    {Caverns[t.cavern].points !== undefined
                      ? Caverns[t.cavern].points
                      : Caverns[t.cavern].pointsF!(props.p)}
                    ) {Cavern[t.cavern].replaceAll("_", "\n")}{" "}
                    {JSON.stringify(Caverns[t.cavern!].supply)}
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
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            {props.p.begging !== undefined && (
              <div>begging: {props.p.begging}</div>
            )}
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
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                className={styles.bubble}
                style={{
                  backgroundColor: utils.getColor(props.p.index),
                }}
              ></div>
              <h4
                style={{ display: "inline-block", margin: 0 }}
                title={JSON.stringify(scoreDict, null, 2)}
              >
                score: {Object.values(scoreDict).sum()}
              </h4>
            </div>
            <h2>{props.p.userName}</h2>
          </div>
          <div>
            {props.p.userId !== store.me.userId ? null : (
              <div className={styles.bubble}>
                <button
                  disabled={!utils.slaughter(props.p, false)}
                  onClick={() => utils.slaughter(props.p, true)}
                >
                  slaughter
                </button>
              </div>
            )}
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
          </div>
        </div>
      </div>
    </div>
  );
}

function Grid<T>(
  props: ExtraPropsType<T> & {
    title: string;
    selectedIndex: number;
  }
) {
  return (
    <div className={styles.bubble}>
      <h4>{props.title}</h4>
      <div>
        <div style={{ height: "2em" }}></div>
        <div>
          {utils
            .count(utils.numRows)
            .reverse()
            .map((i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection:
                    props.selectedIndex === 1 ? "row" : "row-reverse",
                }}
              >
                {utils
                  .count(utils.numCols)
                  .map(
                    (j) =>
                      [i, j, props.selectedIndex] as [number, number, number]
                  )
                  .map((coords, j) => (
                    <Cell key={j} coords={coords} {...props} />
                  ))}
                <div style={{ width: "5em" }}></div>
              </div>
            ))}
          <div style={{ position: "relative" }}>
            {utils
              .getGrid(props.p)
              .filter(
                ({ i, j, k }) =>
                  k === props.selectedIndex && utils.isOutOfBounds([i, j, k])
              )
              .map(({ i, j, k }) => (
                <div
                  key={`${i},${j},${k}`}
                  style={{
                    position: "absolute",
                    right: undefined,
                    bottom: "0",
                    transform: `translate(${100 * j}%, ${100 * -i}%)`,
                  }}
                >
                  <Cell {...props} coords={[i, j, k]} />
                </div>
              ))}
          </div>
        </div>
        <div style={{ height: "4em" }}></div>
      </div>
    </div>
  );
}

function Cell<T>(
  props: ExtraPropsType<T> & { coords: [number, number, number] }
) {
  const isBuilding = utils.getTask().t === Task.build;
  const t = utils.getTile(props.p, props.coords);
  const bonuses = (props.p.tileBonuses || {})[props.coords.join("_")];
  return (
    <div
      key={props.coords.join(".")}
      style={{
        border: "2px solid black",
        width: "7em",
        height: "5em",
        backgroundColor:
          isBuilding || !utils.objEqual(props.coords, props.selected)
            ? undefined
            : "lightgrey",
        cursor:
          !isBuilding || utils.build(props.p, props.coords, false)
            ? "pointer"
            : undefined,
      }}
      onClick={() =>
        isBuilding
          ? utils.build(props.p, props.coords, true)
          : props.updateSelected(
              utils.objEqual(props.coords, props.selected)
                ? undefined
                : props.coords
            )
      }
    >
      {bonuses === undefined ? null : <div>+: {JSON.stringify(bonuses)}</div>}
      {t === undefined ? null : props.f(t as T, props.coords)}
      {t?.resources === undefined
        ? null
        : Object.entries(t.resources).map(([resourceName, count]) => (
            <button
              key={resourceName}
              onClick={(event) =>
                Promise.resolve(event.stopPropagation())
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
                      (t.resources = utils.addResources(t.resources!, {
                        [resourceName]: -1,
                      }))
                  )
                  .then(() => utils.prepareNextTask(`moved up ${resourceName}`))
              }
            >
              {resourceName}: {count}
            </button>
          ))}
    </div>
  );
}
