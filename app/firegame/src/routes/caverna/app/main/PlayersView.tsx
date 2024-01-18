import styles from "../../../../shared/styles.module.css";
import Caverns, { Cavern } from "../utils/Caverns";
import {
  Buildable,
  Coords,
  PlayerType,
  ResourcesType,
  Task,
  TileType,
} from "../utils/NewGame";
import utils, { store } from "../utils/utils";

type PlayersPropsType = {
  selected: Coords | undefined;
  updateSelected: (s: Coords | undefined) => void;
};

type ExtraPropsType = PlayersPropsType & {
  p: PlayerType;
  f: (t: TileType) => JSX.Element | null;
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
            f={(t: TileType) => (
              <div>
                <div>
                  {t.doubleFenceCoords
                    ? "DOUBLE_FENCE"
                    : t.built[Buildable.fence_2]
                    ? "BACKUP_FENCE"
                    : t.built[Buildable.fence]
                    ? "FENCE"
                    : t.resources !== undefined
                    ? null
                    : t.built[Buildable.pasture]
                    ? "PASTURE"
                    : t.built[Buildable.field]
                    ? "FIELD"
                    : null}
                </div>
                <div>{!t.built[Buildable.stable] ? null : "stable"}</div>
              </div>
            )}
            {...props}
          />
          <Grid
            title={"cave"}
            selectedIndex={1}
            f={(t: TileType) => (
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
                    {t.built[Buildable.cavern]
                      ? "CAVERN"
                      : t.built[Buildable.ruby_mine]
                      ? "RUBY_MINE"
                      : t.built[Buildable.ore_mine]
                      ? "ORE_MINE"
                      : t.built[Buildable.ore_tunnel]
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
                        !utils.playerResource(
                          props.p,
                          props.selected,
                          resourceName,
                          false
                        )
                      }
                      onClick={() =>
                        utils.playerResource(
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

function Grid(
  props: ExtraPropsType & {
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
                  .map((j) => ({ i, j, k: props.selectedIndex }))
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
                ({ c }) => c.k === props.selectedIndex && utils.isOutOfBounds(c)
              )
              .map(({ c }) => (
                <div
                  key={utils.coordsToKey(c)}
                  style={{
                    position: "absolute",
                    right: undefined,
                    bottom: "0",
                    transform: `translate(${100 * c.j}%, ${100 * -c.i}%)`,
                  }}
                >
                  <Cell {...props} coords={c} />
                </div>
              ))}
          </div>
        </div>
        <div style={{ height: "4em" }}></div>
      </div>
    </div>
  );
}

function Cell(props: ExtraPropsType & { coords: Coords }) {
  const isBuilding = utils.getTask().t === Task.build;
  const t = utils.getTile(props.p, props.coords);
  const coordsKey = utils.coordsToKey(props.coords);
  const bonuses = (props.p.tileBonuses || {})[coordsKey];
  return (
    <div
      key={coordsKey}
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
      {t === undefined ? null : props.f(t)}
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
                      })!)
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
