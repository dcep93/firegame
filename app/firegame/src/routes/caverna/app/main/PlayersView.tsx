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

type PlayerPropsType = PlayersPropsType & {
  isMe: boolean;
};

type ExtraPropsType = PlayerPropsType & {
  p: PlayerType;
  f: (t: TileType) => JSX.Element | null;
};

export default function PlayersView(props: PlayersPropsType) {
  return (
    <div style={{ alignSelf: "flex-end", maxWidth: "100%" }}>
      <div style={{ overflow: "scroll" }}>
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
              <Player
                key={i}
                p={p}
                isMe={p.userId === store.me.userId}
                {...props}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

function Player(
  props: PlayerPropsType & {
    p: PlayerType;
  }
) {
  const scoreDict = utils.getScoreDict(props.p);
  return (
    <div>
      <div className={[styles.bubble, props.isMe && styles.blue].join(" ")}>
        <div style={{ display: "flex" }}>
          <Grid
            isFarm={true}
            f={(t: TileType) => (
              <div>
                <div>
                  {t.doubleFenceCoords
                    ? "DOUBLE FENCE"
                    : t.built[Buildable.fence_2]
                    ? "BACKUP FENCE"
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
                <div>{!t.built[Buildable.stable] ? null : "STABLE"}</div>
              </div>
            )}
            {...props}
          />
          <Grid
            isFarm={false}
            f={(t: TileType) => (
              <div>
                {t.cavern !== undefined ? (
                  <button
                    style={{ width: "100%" }}
                    title={Caverns[t.cavern].title}
                    disabled={
                      !props.isMe || Caverns[t.cavern!].action === undefined
                    }
                    onClick={() => Caverns[t.cavern!].action!(props.p)}
                  >
                    (
                    {Caverns[t.cavern].points !== undefined
                      ? Caverns[t.cavern].points
                      : Caverns[t.cavern].pointsF!(props.p)}
                    ) {Cavern[t.cavern].replaceAll("_", "\n")}{" "}
                    {utils.stringify(Caverns[t.cavern!].supply)}
                  </button>
                ) : (
                  <div>
                    {t.built[Buildable.cavern]
                      ? "CAVERN"
                      : t.built[Buildable.ruby_mine]
                      ? "RUBY MINE"
                      : t.built[Buildable.ore_mine]
                      ? "ORE MINE"
                      : t.built[Buildable.ore_tunnel]
                      ? "ORE TUNNEL"
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
            <div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  className={styles.bubble}
                  style={{
                    backgroundColor: utils.getColor(props.p.index),
                  }}
                ></div>
                <h4
                  style={{ display: "inline-block", margin: 0 }}
                  title={utils.stringify(scoreDict, "\n")}
                >
                  score: {Object.values(scoreDict).sum()}
                </h4>
                <div style={{ paddingLeft: "1em" }}>
                  {props.p.begging !== 0 && (
                    <div>begging: {props.p.begging}</div>
                  )}
                  <div>
                    ready dwarves:{" "}
                    {(props.p.availableDwarves || []).map((d, i) => (
                      <button
                        key={i}
                        disabled={
                          !props.isMe || !utils.payRubyOutOfOrder(i, false)
                        }
                        style={{
                          padding: "0.5em",
                        }}
                        onClick={() => utils.payRubyOutOfOrder(i, true)}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <h2>{props.p.userName}</h2>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ position: "relative" }}>
              {!props.isMe ? null : (
                <div style={{ position: "absolute", right: 0 }}>
                  <div className={styles.bubble}>
                    <button
                      disabled={!utils.slaughter(false)}
                      onClick={() => utils.slaughter(true)}
                    >
                      slaughter
                    </button>
                  </div>
                </div>
              )}
              {store.gameW.game.harvest === undefined ? null : (
                <div
                  className={styles.bubble}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  food cost: {utils.numToFeed(props.p)}
                </div>
              )}
            </div>
            <div
              className={styles.bubble}
              style={{
                backgroundColor:
                  Object.keys(utils.toSlaughter(props.p)).length > 0
                    ? "lightgrey"
                    : undefined,
              }}
            >
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
                        !props.isMe ||
                        !utils.resourceToTile(
                          props.selected,
                          resourceName,
                          false
                        )
                      }
                      onClick={() =>
                        utils.resourceToTile(props.selected, resourceName, true)
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
    isFarm: boolean;
  }
) {
  return (
    <div className={styles.bubble} style={{ fontSize: "smaller" }}>
      <h4>{props.isFarm ? "FARM" : "CAVE"}</h4>
      <div>
        <div style={{ height: "3em" }}></div>
        <div>
          {utils
            .count(utils.numRows)
            .reverse()
            .map((i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: props.isFarm ? "row-reverse" : "row",
                }}
              >
                {utils
                  .count(utils.numCols)
                  .map((j) => ({ i, j, k: props.isFarm ? 0 : 1 }))
                  .map((coords, j) => (
                    <Cell key={j} coords={coords} {...props} />
                  ))}
                <div style={{ width: "6em" }}></div>
              </div>
            ))}
          <div style={{ position: "relative" }}>
            {utils
              .getGrid(props.p)
              .filter(({ c }) => utils.isOutOfBounds(c))
              .filter(({ c }) => utils.isFarm(c) === props.isFarm)
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
        <div style={{ height: "5em" }}></div>
      </div>
    </div>
  );
}

function Cell(props: ExtraPropsType & { coords: Coords }) {
  const isBuilding = utils.getTask().t === Task.build;
  const t = utils.getTile(props.coords, props.p);
  const coordsKey = utils.coordsToKey(props.coords);
  const bonuses = (props.p.tileBonuses || {})[coordsKey];
  const canClick =
    props.isMe && (!isBuilding || utils.build(props.coords, false));
  const buttonEnabled = !utils.isFarm(props.coords) && props.isMe;
  return (
    <div
      key={coordsKey}
      style={{
        border: "2px solid black",
        textAlign: "center",
        width: "8em",
        height: "8em",
        backgroundColor:
          isBuilding || !utils.objEqual(props.coords, props.selected)
            ? undefined
            : "lightgrey",
        cursor: canClick ? "pointer" : undefined,
      }}
      onClick={() =>
        canClick &&
        (isBuilding
          ? utils.build(props.coords, true)
          : props.updateSelected(
              utils.objEqual(props.coords, props.selected)
                ? undefined
                : props.coords
            ))
      }
    >
      {bonuses === undefined ? null : <div>{utils.stringify(bonuses)}</div>}
      {t === undefined ? null : props.f(t)}
      {t?.resources === undefined
        ? null
        : Object.entries(t.resources).map(([resourceName, count]) => (
            <button
              key={resourceName}
              disabled={!buttonEnabled}
              onClick={(event) =>
                buttonEnabled &&
                Promise.resolve(event.stopPropagation())
                  .then(() =>
                    utils.moveResources({
                      [resourceName]: 1,
                    })
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
