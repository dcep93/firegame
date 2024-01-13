import styles from "../../../../shared/styles.module.css";
import ExpeditionActions, {
  ExpeditionAction,
} from "../utils/ExpeditionActions";
import RubyActions, { RubyAction } from "../utils/RubyActions";
import utils from "../utils/utils";

function ExpeditionsElement() {
  return (
    <div className={styles.bubble}>
      <h3>expeditions</h3>
      <div style={{ display: "flex", flexWrap: "wrap", width: "30em" }}>
        {utils.enumArray(ExpeditionAction).map((a) => (
          <div key={a} style={{ flexBasis: "33%", display: "flex" }}>
            <div className={styles.bubble} style={{ flexGrow: 1 }}>
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
            <div className={styles.bubble} style={{ flexGrow: 1 }}>
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

export default function CardActions() {
  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      <ExpeditionsElement />
      <RubiesElement />
    </div>
  );
}
