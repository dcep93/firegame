import styles from "../../../../shared/styles.module.css";
import { PlayerType, ResourcesType } from "../utils/NewGame";
import utils from "../utils/utils";

export default function Player(props: { p: PlayerType }) {
  return (
    <div>
      <div
        className={[
          styles.bubble,
          utils.getCurrent().userId === props.p.userId && styles.blue,
        ].join(" ")}
      >
        <h2>{props.p.userName}</h2>
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
        </div>
        <div style={{ display: "flex" }}>
          <Farm p={props.p} />
          <Cave p={props.p} />
        </div>
      </div>
    </div>
  );
}

function Farm(props: { p: PlayerType }) {
  return <div className={styles.bubble}>farm</div>;
}

function Cave(props: { p: PlayerType }) {
  return <div className={styles.bubble}>cave</div>;
}
