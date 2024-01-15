import styles from "../../../../shared/styles.module.css";
import ExpeditionActions, {
  ExpeditionAction,
} from "../utils/ExpeditionActions";
import RubyActions, { RubyAction } from "../utils/RubyActions";
import utils from "../utils/utils";

export default function ExpeditionsAndRubiesView() {
  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      <ExpeditionsElement />
      <RubiesElement />
    </div>
  );
}

function ExpeditionsElement() {
  const me = utils.getMe();
  return (
    <div className={styles.bubble}>
      <h3>expeditions</h3>
      <div style={{ display: "flex", flexWrap: "wrap", width: "30em" }}>
        {utils.enumArray(ExpeditionAction).map((a) => (
          <div key={a} style={{ flexBasis: "33%", display: "flex" }}>
            <div
              className={styles.bubble}
              style={{
                flexGrow: 1,
                cursor: utils.canExpedition(a, me) ? "pointer" : undefined,
              }}
              onClick={() => utils.expedition(a, me)}
            >
              <div>level: {ExpeditionActions[a].level}</div>
              <div style={{ width: 0 }}>{ExpeditionAction[a]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RubiesElement() {
  const me = utils.getMe();
  return (
    <div className={styles.bubble}>
      <h3>ruby trader</h3>
      <div style={{ display: "flex", flexWrap: "wrap", width: "16em" }}>
        {utils.enumArray(RubyAction).map((a) => (
          <div
            key={a}
            style={{
              flexBasis: RubyActions[a].cost ? "52%" : "49%",
              display: "flex",
            }}
          >
            <div
              className={styles.bubble}
              style={{
                flexGrow: 1,
                cursor: utils.canRubyTrade(a, me) ? "pointer" : undefined,
              }}
            >
              <div style={{ width: 0 }}>{RubyAction[a]}</div>
              {RubyActions[a].cost && (
                <div>cost: {JSON.stringify(RubyActions[a].cost!)}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
