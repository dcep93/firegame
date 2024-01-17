import { useState } from "react";
import styles from "../../../../shared/styles.module.css";
import { Cavern } from "../utils/Caverns";
import { ExpeditionAction } from "../utils/ExpeditionActions";
import { Buildable, Harvest, ResourcesType, Task } from "../utils/NewGame";
import utils, { store } from "../utils/utils";
import BuildSelector from "./BuildSelector";

function Current() {
  return (
    <div className={styles.bubble}>
      <div>
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
                            expeditionsTaken: Object.entries(
                              t.d.expeditionsTaken
                            )
                              .map(([k, v]) => ({
                                k: ExpeditionAction[parseInt(k)],
                                v,
                              }))
                              .filter(({ v }) => v)
                              .map(({ k }) => k)
                              .join("/"),
                          },
                      t.d.build === undefined
                        ? null
                        : {
                            build: Buildable[t.d.build],
                          }
                    )
                  )}
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => window.undo()}
        disabled={store.me?.userId !== store.gameW.info.playerId}
      >
        undo
      </button>
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
  return !utils.getTask()?.d?.canSkip ? null : (
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

function Special() {
  const [state, updateState] = useState<any>(null);
  const task = utils.getTask();
  const p = utils.getCurrent()!;
  if (task.t === Task.weekly_market) {
    return (
      <div className={styles.bubble}>
        <button
          onClick={() =>
            Promise.resolve()
              .then(() => utils.shiftTask())
              .then(() => utils.prepareNextTask("finished weekly market"))
          }
        >
          finish
        </button>
        {Object.entries(task.d!.rs!)
          .map(([r, gold]) => ({
            r,
            gold,
            cost: { gold: -gold, [r as keyof ResourcesType]: 1 },
          }))
          .map(({ r, cost, gold }) => (
            <button
              key={r}
              disabled={
                utils.addResources(p.resources || {}, cost) === undefined
              }
              onClick={() =>
                Promise.resolve()
                  .then(() => delete task.d!.rs![r as keyof ResourcesType])
                  .then(() => utils.addResourcesToPlayer(p, cost))
                  .then(() => utils.prepareNextTask(`bought ${r}`))
              }
            >
              {gold}: {r}
            </button>
          ))}
      </div>
    );
  }
  if (
    task.t === Task.furnish &&
    task.d?.num === undefined &&
    p.caverns[Cavern.builder]
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
                      r: builderResource as keyof ResourcesType,
                    })
                )
                .then(() =>
                  utils.prepareNextTask(`converted ore for ${builderResource}`)
                )
            }
          >
            ore for {builderResource}
          </button>
        ))}
      </div>
    );
  }
  if (task.t === Task.wish_for_children) {
    return (
      <div className={styles.bubble}>
        <button
          onClick={() =>
            Promise.resolve()
              .then(() => utils.shiftTask())
              .then(() =>
                utils.queueTasks([
                  { t: Task.furnish, d: { build: Buildable.dwelling } },
                ])
              )
              .then(() => utils.prepareNextTask("will furnish dwelling"))
          }
        >
          get {JSON.stringify(utils.growthRewards())}
        </button>
        <button
          onClick={() =>
            Promise.resolve()
              .then(() => utils.shiftTask())
              .then(() => utils.haveChild(p, true))
              .then(() => utils.prepareNextTask("had a baby"))
          }
        >
          have baby
        </button>
      </div>
    );
  }
  if (task.t === Task.growth) {
    return (
      <div className={styles.bubble}>
        <button
          onClick={() =>
            Promise.resolve()
              .then(() => utils.addResourcesToPlayer(p, utils.growthRewards()))
              .then(() => utils.shiftTask())
              .then(() => utils.prepareNextTask("got resources"))
          }
        >
          get {JSON.stringify(utils.growthRewards())}
        </button>
        <button
          onClick={() =>
            Promise.resolve()
              .then(() => utils.haveChild(p, true))
              .then(() => utils.shiftTask())
              .then(() => utils.prepareNextTask("had a baby"))
          }
        >
          have baby
        </button>
      </div>
    );
  }
  if (
    task.t === Task.harvest &&
    store.gameW.game.harvest === Harvest.skip_one &&
    task.d!.num === undefined
  ) {
    return (
      <div className={styles.bubble}>
        {["skip pulling off fields", "skip breeding"].map((text, i) => (
          <button
            onClick={() =>
              Promise.resolve()
                .then(() => (task.d = { num: i }))
                .then(() => i === 1 && utils.pullOffFields(p))
                .then(() => utils.prepareNextTask(`chose to ${text}`))
            }
          >
            {text}
          </button>
        ))}
      </div>
    );
  }
  if (task.t === Task.have_baby) {
    return (
      <div className={styles.bubble}>
        <button
          onClick={() =>
            Promise.resolve()
              .then(() => utils.shiftTask())
              .then(() => utils.prepareNextTask("aborted the baby"))
          }
        >
          abort the baby
        </button>
        <button
          onClick={() =>
            Promise.resolve(() => utils.haveChild(p, true))
              .then(() => utils.shiftTask())
              .then(() => utils.prepareNextTask("had a baby"))
          }
        >
          have the baby
        </button>
      </div>
    );
  }
  if (task.t === Task.breed_2) {
    const breedables = utils.getBreedables(p);
    return (
      <div className={styles.bubble}>
        {breedables.map((r) => (
          <button
            key={r}
            onClick={() =>
              Promise.resolve()
                .then(() => utils.addResourcesToPlayer(p, { [r]: 1 }))
                .then(
                  () =>
                    p.caverns[Cavern.breeding_cave] &&
                    utils.addResourcesToPlayer(p, { food: 1 })
                )
                .then(
                  () =>
                    p.caverns[Cavern.quarry] &&
                    r === "donkeys" &&
                    utils.addResourcesToPlayer(p, { stone: 1 })
                )
                .then(() => task.d!.num!--)
                .then(() => (task.d!.r = r))
                .then(() => utils.prepareNextTask(`bred ${r}`))
            }
          >
            {r}
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
  if (task.t === Task.extension) {
    return (
      <div className={styles.bubble}>
        <button
          onClick={() =>
            Promise.resolve()
              .then(() => utils.shiftTask())
              .then(() =>
                utils.queueTasks([
                  {
                    t: Task.build,
                    d: { build: Buildable.farm_tile, rs: { wood: 1 } },
                  },
                ])
              )
              .then(() => utils.prepareNextTask("will build farm_tile"))
          }
        >
          farm_tile + wood
        </button>
        <button
          onClick={() =>
            Promise.resolve()
              .then(() => utils.shiftTask())
              .then(() =>
                utils.queueTasks([
                  {
                    t: Task.build,
                    d: { build: Buildable.cavern_tunnel, rs: { stone: 1 } },
                  },
                ])
              )
              .then(() => utils.prepareNextTask("will build cavern_tunnel"))
          }
        >
          cavern_tunnel + stone
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
  if (task.t === Task.forge) {
    const blacksmithDiscount = p.caverns[Cavern.blacksmith] ? 2 : 0;
    if (state === null) updateState(1);
    return (
      <div className={styles.bubble}>
        <input
          type="range"
          min={1 + blacksmithDiscount}
          max={Math.min(
            8,
            (utils.getCurrent().resources?.ore || 0) + blacksmithDiscount
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
          max={Math.min(4, utils.getCurrent().resources?.gold || 0)}
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
              .then(() => utils.shiftTask())
              .then(() =>
                utils.prepareNextTask(`ate ${state} gold for ${state - 1} food`)
              )
          }
        >
          eat {state} gold
        </button>
      </div>
    );
  }
  if (task.t === Task.build) {
    return <BuildSelector />;
  }
  return null;
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
      {utils.isMyTurn() && <Special />}
    </div>
  );
}
