import { useState } from "react";
import styles from "../../../../shared/styles.module.css";
import { growthRewards } from "../utils/Actions";
import { Cavern } from "../utils/Caverns";
import { Buildable, Harvest, ResourcesType, Task } from "../utils/NewGame";
import utils, { store } from "../utils/utils";
import BuildSelector from "./BuildSelector";

export default function SpecialTaskView() {
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
        {Object.entries(task.d!.availableResources!)
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
                  .then(
                    () =>
                      delete task.d!.availableResources![
                        r as keyof ResourcesType
                      ]
                  )
                  .then(() => utils.addResourcesToPlayer(cost))
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
    task.d?.availableResources === undefined &&
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
                  utils.addResourcesToPlayer({
                    [builderResource]: 1,
                    ore: -1,
                  })
                )
                .then(
                  () =>
                    (store.gameW.game.tasks[0].d = {
                      availableResources: { [builderResource]: 1 },
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
                  {
                    t: Task.furnish,
                    d: { build: Buildable.wish_for_children },
                  },
                ])
              )
              .then(() => utils.prepareNextTask("will furnish dwelling"))
          }
        >
          get {utils.stringify(growthRewards)}
        </button>
        <button
          onClick={() =>
            Promise.resolve()
              .then(() => utils.shiftTask())
              .then(() => utils.haveChild(true))
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
              .then(() => utils.addResourcesToPlayer(growthRewards))
              .then(() => utils.shiftTask())
              .then(() => utils.prepareNextTask("got resources"))
          }
        >
          get {utils.stringify(growthRewards)}
        </button>
        <button
          onClick={() =>
            Promise.resolve()
              .then(() => utils.haveChild(true))
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
    task.d!.magicBoolean === undefined
  ) {
    return (
      <div className={styles.bubble}>
        {["skip pulling off fields", "skip breeding"].map((text, i) => (
          <button
            onClick={() =>
              Promise.resolve()
                .then(() => (task.d = { magicBoolean: i === 0 }))
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
            Promise.resolve(() => utils.haveChild(true))
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
    const breedables = utils.getBreedables();
    return (
      <div className={styles.bubble}>
        {breedables.map((r) => (
          <button
            key={r}
            onClick={() =>
              Promise.resolve()
                .then(() => utils.addResourcesToPlayer({ [r]: 1 }))
                .then(
                  () =>
                    p.caverns[Cavern.breeding_cave] &&
                    utils.addResourcesToPlayer({ food: 1 })
                )
                .then(
                  () =>
                    p.caverns[Cavern.quarry] &&
                    r === "donkeys" &&
                    utils.addResourcesToPlayer({ stone: 1 })
                )
                .then(
                  () =>
                    (task.d!.availableResources = utils.addResources(
                      task.d!.availableResources!,
                      { [r]: -1 }
                    ))
                )
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
              .then(() => task.d!.remaining!--)
              .then(() =>
                utils.addResourcesToPlayer({ ore: -2, gold: 2, food: 1 })
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
                    d: { build: Buildable.farm_tile, buildReward: { wood: 1 } },
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
                    d: {
                      build: Buildable.cavern_tunnel,
                      buildReward: { stone: 1 },
                    },
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
                .then(() => utils.addResourcesToPlayer(reward))
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
                  .then(() => utils.addResourcesToPlayer({ food }))
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
                  .then(() => utils.addResourcesToPlayer({ food }))
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
        <button onClick={() => utils.forge(state, true)}>forge {state}</button>
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
                utils.addResourcesToPlayer({ gold: -state, food: state - 1 })
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
