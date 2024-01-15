import styles from "../../../../shared/styles.module.css";
import { PlayerType, ResourcesType } from "../utils/NewGame";
import utils from "../utils/utils";

// click animal -> goes to slaughterhouse
// select square -> click animal -> goes to square

export default function Player(props: {
  p: PlayerType;
  selected: [number, number, number] | undefined;
  updateSelected: (s: [number, number, number]) => void;
}) {
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
                cursor: utils.canPayRubyOutOfOrder(props.p, i)
                  ? "pointer"
                  : undefined,
              }}
              onClick={() => utils.payRubyOutOfOrder(props.p, i)}
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
              <div key={i}>
                {resourceName}: {count}
              </div>
            ))}
        </div>
        <div>
          {props.p.userId !== utils.getMe().userId ? null : (
            <button
              disabled={!utils.canSlaughter(props.p)}
              onClick={() => utils.slaughter(props.p)}
            >
              slaughter
            </button>
          )}
        </div>
        <div style={{ display: "flex" }}>
          <Grid
            p={props.p}
            title={"farm"}
            f={(i, j) => (
              <div>
                {i}.{j}
              </div>
            )}
            selected={
              (props.selected || [])[2] !== 0 ? undefined : props.selected
            }
            updateSelected={(i: number, j: number) =>
              props.updateSelected([i, j, 0])
            }
          />
          <Grid
            p={props.p}
            title={"cave"}
            f={(i, j) => (
              <div>
                {i}.{j}
              </div>
            )}
            selected={
              (props.selected || [])[2] !== 1 ? undefined : props.selected
            }
            updateSelected={(i: number, j: number) =>
              props.updateSelected([i, j, 1])
            }
          />
        </div>
      </div>
    </div>
  );
}

function Grid(props: {
  p: PlayerType;
  title: string;
  f: (i: number, j: number) => JSX.Element;
  selected: [number, number, number] | undefined;
  updateSelected: (i: number, j: number) => void;
}) {
  return (
    <div className={styles.bubble}>
      <h4>{props.title}</h4>
      {utils.count(4).map((i) => (
        <div key={i} style={{ display: "flex" }}>
          {utils.count(3).map((j) => (
            <div
              key={`${i}.${j}`}
              style={{
                border: "2px solid black",
                width: "8em",
                height: "4em",
                backgroundColor:
                  props.selected === undefined ||
                  props.selected[0] !== i ||
                  props.selected[1] !== j
                    ? undefined
                    : "lightgrey",
              }}
              onClick={() => props.updateSelected(i, j)}
            >
              {props.f(i, j)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
