import styles from "../../../../shared/styles.module.css";
import { PlayerType, ResourcesType, Task } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

export default function Player(props: { p: PlayerType }) {
  const scoreDict = utils.getScoreDict(props.p);
  return (
    <div>
      <div
        className={[
          styles.bubble,
          utils.getCurrent().userId === props.p.userId && styles.blue,
        ].join(" ")}
      >
        <h2>{props.p.userName}</h2>
        <h4 title={JSON.stringify(scoreDict, null, 2)}>
          score: {Object.values(scoreDict).sum()}
        </h4>
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
          <button
            disabled={!utils.canSlaughter(props.p)}
            onClick={() => utils.slaughter(props.p)}
          >
            slaughter
          </button>
          {store.gameW.game.tasks[0].t === Task.feed &&
            props.p.userId === utils.getMe().userId &&
            utils.isMyTurn() && (
              <button
                disabled={utils.canFeed(props.p)}
                onClick={() => utils.feed(props.p)}
              >
                feed
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
          />
          <Grid
            p={props.p}
            title={"cave"}
            f={(i, j) => (
              <div>
                {i}.{j}
              </div>
            )}
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
}) {
  return (
    <div className={styles.bubble}>
      <h4>{props.title}</h4>
      {utils.count(4).map((i) => (
        <div key={i} style={{ display: "flex" }}>
          {utils.count(3).map((j) => (
            <div
              key={`${i}.${j}`}
              style={{ border: "2px solid black", width: "8em", height: "4em" }}
            >
              {props.f(i, j)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
