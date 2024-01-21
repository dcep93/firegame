import styles from "../../../../shared/styles.module.css";
import { ExpeditionAction } from "../utils/ExpeditionActions";
import { Buildable, Harvest, Task } from "../utils/NewGame";
import utils, { store } from "../utils/utils";
import SpecialTaskView from "./SpecialTaskView";

function Current() {
  // TODO upcoming actions
  return (
    <div className={styles.bubble}>
      <div>
        <div>year: {store.gameW.game.year}</div>
        <div>current: {utils.getCurrent().userName}</div>
        {store.gameW.game.harvest === undefined ? null : (
          <div>harvest {Harvest[store.gameW.game.harvest]}</div>
        )}
        {
          <div>
            {store.gameW.game.tasks.map((t, i) => (
              <div key={i} style={{ display: "flex" }}>
                <div>{Task[t.t]}</div>
                {t.d === undefined ? null : (
                  <div style={{ paddingLeft: "1em" }}>
                    {utils.stringify(
                      Object.assign(
                        {},
                        null,
                        t.d,
                        t.d.expeditionsTaken === undefined
                          ? null
                          : {
                              expeditionsTaken: Object.keys(
                                t.d.expeditionsTaken
                              )
                                .map((k) => ExpeditionAction[parseInt(k)])
                                .join("/"),
                            },
                        t.d.build === undefined
                          ? null
                          : {
                              build: Buildable[t.d.build],
                            },
                        t.d.buildReward === undefined
                          ? null
                          : {
                              buildReward: utils.stringify(t.d.buildReward),
                            },
                        t.d.availableResources === undefined
                          ? null
                          : {
                              availableResources: utils.stringify(
                                t.d.availableResources
                              ),
                            }
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        }
      </div>
      <div style={{ textAlign: "right" }}>
        <div>
          starting player:{" "}
          {store.gameW.game.players[store.gameW.game.startingPlayer].userName}
        </div>
        <div>
          random harvests:{" "}
          {(store.gameW.game.randomHarvests || [])
            .map((h) => Harvest[h])
            .join("/")}
        </div>
        <div>
          upcoming harvests:{" "}
          {(store.gameW.game.upcomingHarvests || [])
            .map((h) => Harvest[h])
            .join("/")}
        </div>
      </div>
    </div>
  );
}

function Skip() {
  const t = utils.getTask();
  return !t?.d?.canSkip && t?.t !== Task.sow ? null : (
    <div className={styles.bubble}>
      <button
        onClick={() =>
          utils.prepareNextTask(`skipped ${Task[utils.shiftTask().t]}`)
        }
      >
        skip
      </button>
    </div>
  );
}

export default function TaskView() {
  return (
    <div>
      <div>
        <Current />
      </div>
      <div>
        <Skip />
      </div>
      {utils.isMyTurn() && <SpecialTaskView />}
    </div>
  );
}
