import { useState } from "react";
import styles from "../../../../shared/styles.module.css";
import { Cavern } from "../utils/Caverns";
import { ExpeditionAction } from "../utils/ExpeditionActions";
import { Buildable, ResourcesType, Task } from "../utils/NewGame";
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
                    t.d.build === undefined
                      ? null
                      : {
                          toBuild: Buildable[t.d.build],
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
  const p = utils.getCurrent()!;
  if (
    (task.t === Task.furnish_dwelling || task.t === Task.furnish_cavern) &&
    task.d?.num === undefined &&
    p.boughtTiles[Cavern.builder]
  ) {
    return (
      <div className={styles.bubble}>
        {["wood", "stone"].map((builderResource) => (
          <button
            key={builderResource}
            disabled={
              utils.addResources(p.resources || {}, { ore: -1 }) === undefined
            }
            onClick={() =>
              Promise.resolve()
                .then(() =>
                  utils.addResourcesToPlayer(p, {
                    [builderResource]: 1,
                    ore: -1,
                  })
                )
                .then(
                  () =>
                    (store.gameW.game.tasks[0].d = {
                      resource: builderResource as keyof ResourcesType,
                    })
                )
                .then(() =>
                  store.update(`converted ore for ${builderResource}`)
                )
            }
          >
            ore for {builderResource}
          </button>
        ))}
      </div>
    );
  }
  if (task.t === Task.ore_trading) {
    return (
      <div className={styles.bubble}>
        <button
          onClick={() =>
            Promise.resolve()
              .then(() => task.d!.num!--)
              .then(() =>
                utils.addResourcesToPlayer(p, { ore: -2, gold: 2, food: 1 })
              )
              .then(() =>
                utils.prepareNextTask("traded 2 ore for 2 [gold] and 1 [food]")
              )
          }
        >
          trade 2 ore
        </button>
        <button
          onClick={() =>
            Promise.resolve()
              .then(() => utils.shiftTask())
              .then(() => utils.prepareNextTask("finished trading"))
          }
        >
          finish trading
        </button>
      </div>
    );
  }
  if (task.t === Task.beer_parlor) {
    return (
      <div className={styles.bubble}>
        {[
          { message: "3 gold", reward: { gold: 3 } },
          { message: "4 food", reward: { food: 4 } },
        ].map(({ message, reward }) => (
          <button
            key={message}
            onClick={() =>
              Promise.resolve()
                .then(() => utils.shiftTask())
                .then(() => utils.addResourcesToPlayer(p, reward))
                .then(() => utils.prepareNextTask(`earned ${message}`))
            }
          >
            {message}
          </button>
        ))}
      </div>
    );
  }
  if (task.t === Task.peaceful_cave) {
    <div className={styles.bubble}>
      {(p.usedDwarves || [])
        .filter((d) => d > 0)
        .map((d, i) => (
          <button
            key={i}
            onClick={() =>
              Promise.resolve(p.usedDwarves![i]).then((food) =>
                Promise.resolve()
                  .then(() => (p.usedDwarves![i] = 0))
                  .then(() => p.usedDwarves!.sort((a, b) => a - b))
                  .then(() => utils.addResourcesToPlayer(p, { food }))
                  .then(() => utils.shiftTask())
                  .then(() => utils.prepareNextTask(`traded used ${food}`))
              )
            }
          >
            eat used {d}
          </button>
        ))}
      {(p.availableDwarves || [])
        .filter((d) => d > 0)
        .map((d, i) => (
          <button
            key={i}
            onClick={() =>
              Promise.resolve(p.availableDwarves![i]).then((food) =>
                Promise.resolve()
                  .then(() => (p.availableDwarves![i] = 0))
                  .then(() => p.availableDwarves!.sort((a, b) => a - b))
                  .then(() => utils.addResourcesToPlayer(p, { food }))
                  .then(() => utils.shiftTask())
                  .then(() => utils.prepareNextTask(`traded available ${food}`))
              )
            }
          >
            eat available {d}
          </button>
        ))}
    </div>;
  }
  if (task.t === Task.feed_tmp) {
    return (
      <div className={styles.bubble}>
        <button
          disabled={!utils.feed(p, false)}
          onClick={() => utils.feed(p, true)}
        >
          feed
        </button>
      </div>
    );
  }
  if (task.t === Task.forge) {
    const blacksmithDiscount = p.boughtTiles[Cavern.blacksmith] ? 2 : 0;
    if (state === null) updateState(1);
    return (
      <div className={styles.bubble}>
        <input
          type="range"
          min={1 + blacksmithDiscount}
          max={Math.min(
            8,
            (utils.getMe().resources?.ore || 0) + blacksmithDiscount
          )}
          value={state}
          onChange={(event) => updateState(event.target.value)}
          step={1}
        />
        <button onClick={() => utils.forge(p, state, true)}>
          forge {state}
        </button>
      </div>
    );
  }
  if (task.t === Task.eat_gold) {
    if (state === null) updateState(1);
    return (
      <div className={styles.bubble}>
        <input
          type="range"
          min={1}
          max={Math.min(4, utils.getMe().resources?.gold || 0)}
          value={state}
          onChange={(event) => updateState(event.target.value)}
          step={1}
        />
        <button
          onClick={() =>
            Promise.resolve()
              .then(() =>
                utils.addResourcesToPlayer(p, { gold: -state, food: state - 1 })
              )
              .then(() => utils.shiftTask() !== undefined)
              .then(() =>
                store.update(`ate ${state} gold for ${state - 1} food`)
              )
          }
        >
          eat {state} gold
        </button>
      </div>
    );
  }
  if (task.t === Task.build) {
    return (
      <div className={styles.bubble}>
        <button
          onClick={() =>
            utils.prepareNextTask(
              `skipped building ${Task[utils.shiftTask().d!.build!]}`
            )
          }
        >
          skip build
        </button>
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
