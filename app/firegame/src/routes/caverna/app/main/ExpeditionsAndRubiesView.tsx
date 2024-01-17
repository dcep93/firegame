import styles from "../../../../shared/styles.module.css";
import ExpeditionActions, {
  ExpeditionAction,
} from "../utils/ExpeditionActions";
import RubyActions, { RubyAction } from "../utils/RubyActions";
import utils from "../utils/utils";
import Button from "./Button";

export default function ExpeditionsAndRubiesView() {
  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      <ExpeditionsElement />
      <RubiesElement />
    </div>
  );
}

function ExpeditionsElement() {
  const p = utils.getCurrent();
  return (
    <div className={styles.bubble}>
      <h3>expeditions</h3>
      <div style={{ display: "flex", flexWrap: "wrap", width: "30em" }}>
        {[-1].concat(utils.enumArray(ExpeditionAction)).map((a) => (
          <div key={a} style={{ flexBasis: "24%", display: "flex" }}>
            <div
              style={{
                flexGrow: 1,
                height: "4em",
                margin: "0.5em",
              }}
            >
              {a < 0 ? null : (
                <Button
                  text={ExpeditionAction[a]}
                  disabled={!utils.expedition(a, p, false)}
                  onClick={() => utils.expedition(a, p, true)}
                >
                  <div style={{ padding: "0.2em" }}>
                    level: {ExpeditionActions[a as ExpeditionAction].level}
                  </div>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RubiesElement() {
  const p = utils.getCurrent();
  return (
    <div className={styles.bubble}>
      <h3>ruby trader</h3>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "16em",
        }}
      >
        {utils.enumArray(RubyAction).map((a) => (
          <div
            key={a}
            style={{
              flexBasis: RubyActions[a].cost ? "100%" : "40%",
              height: "4em",
            }}
          >
            <Button
              disabled={!utils.rubyTrade(a, p, false)}
              text={RubyAction[a]}
              onClick={() => utils.rubyTrade(a, p, true)}
            >
              {RubyActions[a].cost && (
                <div>cost: {JSON.stringify(RubyActions[a].cost!)}</div>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
