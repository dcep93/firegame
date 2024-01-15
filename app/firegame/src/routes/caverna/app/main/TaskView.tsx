import { useState } from "react";
import styles from "../../../../shared/styles.module.css";
import { ExpeditionAction } from "../utils/ExpeditionActions";
import { Buildable, Task } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

function Current() {
  return (
    <div className={styles.bubble}>
      <div>current: {utils.getCurrent().userName}</div>
      <div>
        {store.gameW.game.tasks.map((t, i) => (
          <div key={i} style={{ display: "flex" }}>
            <div>{Task[t.t]}</div>
            {t.d === undefined
              ? null
              : JSON.stringify(
                  Object.assign(
                    {},
                    null,
                    t.d,
                    t.d.expeditionsTaken === undefined
                      ? null
                      : {
                          expeditionsTaken: Object.entries(t.d.expeditionsTaken)
                            .map(([k, v]) => ({
                              k: ExpeditionAction[parseInt(k)],
                              v,
                            }))
                            .filter(({ v }) => v)
                            .map(({ k }) => k)
                            .join(","),
                        },
                    t.d.toBuild === undefined
                      ? null
                      : {
                          toBuild: Buildable[t.d.toBuild],
                        }
                  )
                )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Special() {
  const [state, updateState] = useState<any>(null);
  const task = utils.getTask();
  if (task.t === Task.forge) {
    if (state === null) updateState(1);
    return (
      <div className={styles.bubble}>
        <input
          type="range"
          min={1}
          max={Math.min(8, utils.getMe().resources!.ore!)}
          value={state}
          onChange={(event) => updateState(event.target.value)}
          step={1}
        />
        <button onClick={() => utils.forge(utils.getCurrent(), state)}>
          forge {state}
        </button>
      </div>
    );
  }
  if (task.t === Task.build) {
    return (
      <div className={styles.bubble}>
        <button onClick={() => utils.skipBuild()}>skip</button>
      </div>
    );
  }
  return null;
}

export default function TaskView() {
  return (
    <div>
      <Current />
      {utils.isMyTurn() && <Special />}
    </div>
  );
}
