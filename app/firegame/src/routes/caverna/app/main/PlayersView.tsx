import styles from "../../../../shared/styles.module.css";
import { PlayerType, ResourcesType } from "../utils/NewGame";
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
            <span
              key={i}
              style={{
                padding: "0.5em",
                cursor: utils.payRubyOutOfOrder(props.p, i, false)
                  ? "pointer"
                  : undefined,
              }}
              onClick={() => utils.payRubyOutOfOrder(props.p, i, true)}
            >
              {d}
            </span>
          ))}
        </div>
        {props.p.begging !== undefined && <div>begging: {props.p.begging}</div>}
        <div>
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
              <div
                key={i}
                style={{
                  cursor: utils.doResource(
                    props.p,
                    props.selected,
                    resourceName,
                    false
                  )
                    ? "pointer"
                    : undefined,
                }}
                onClick={() =>
                  utils.doResource(props.p, props.selected, resourceName, true)
                }
              >
                {resourceName}: {count}
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
            // TODO render farm
            f={([i, j, k]) => (
              <div>
                {i}.{j}
              </div>
            )}
            {...props}
          />
          <Grid
            title={"cave"}
            selectedIndex={1}
            // TODO render cave
            f={([i, j, k]) => (
              <div>
                {i}.{j}
              </div>
            )}
            {...props}
          />
        </div>
      </div>
    </div>
  );
}

function Grid(
  props: {
    p: PlayerType;
    title: string;
    selectedIndex: number;
    f: (coords: [number, number, number]) => JSX.Element;
  } & SelectedPropsType
) {
  return (
    <div className={styles.bubble}>
      <h4>{props.title}</h4>
      {utils.count(4).map((i) => (
        <div key={i} style={{ display: "flex" }}>
          {utils
            .count(3)
            .map((j) => [i, j, props.selectedIndex] as [number, number, number])
            .map((coords) => (
              <div
                key={coords.join(".")}
                style={{
                  border: "2px solid black",
                  width: "8em",
                  height: "4em",
                  backgroundColor: !utils.objEqual(coords, props.selected)
                    ? undefined
                    : "lightgrey",
                  cursor: utils.buildHere(props.p, coords, false)
                    ? "pointer"
                    : undefined,
                }}
                onClick={() =>
                  utils.buildHere(props.p, coords, true) ||
                  props.updateSelected(
                    utils.objEqual(coords, props.selected) ? undefined : coords
                  )
                }
              >
                {props.f(coords)}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

// updateSelected={(s: [number, number, number]) =>
//   p.userId === store.me.userId &&
//   (JSON.stringify(props.selected) === JSON.stringify(s)
//     ? props.updateSelected(undefined)
//     : props.updateSelected(s))
// }
// selected={p.userId !== store.me.userId ? undefined : props.selected}
