import { useState } from "react";
import styles from "../../../../shared/styles.module.css";
import { ExpeditionAction } from "../utils/ExpeditionActions";
import { Buildable, ResourcesType, Task } from "../utils/NewGame";
import { Tile } from "../utils/Tiles";
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
  const p = utils.getCurrent()!;
  if (
    task.d?.num === undefined &&
    p.boughtTiles[Tile.builder] &&
    (task.t === Task.furnish_dwelling || task.t === Task.furnish_cavern)
  ) {
    return (
      <div className={styles.bubble}>
        {[
          { builderResource: "wood", convert: { wood: 1 } },
          { builderResource: "stone", convert: { stone: 1 } },
        ].map(({ builderResource, convert }) => (
          <button
            key={builderResource}
            disabled={
              utils.addResources(p.resources || {}, { ore: -1 }) === undefined
            }
            onClick={() =>
              utils.builderExchange(p, builderResource as keyof ResourcesType)
            }
          >
            ore for {builderResource}
          </button>
        ))}
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
            onClick={() => utils.beerParlor(p, message, reward)}
          >
            {message}
          </button>
        ))}
      </div>
    );
  }
  if (task.t === Task.feed) {
    return (
      <div className={styles.bubble}>
        <button onClick={() => utils.feed(p)}>feed</button>
        {!p.boughtTiles[Tile.working_cave] ||
        task.d?.num !== undefined ? null : (
          <div>
            {[
              { message: "eat wood", cost: { wood: -1 } },
              { message: "eat stone", cost: { stone: -1 } },
              { message: "eat 2 ore", cost: { ore: -2 } },
            ].map(({ message, cost }) => (
              <button
                key={message}
                disabled={
                  utils.addResources(p.resources || {}, cost) === undefined
                }
                onClick={() => utils.workingCave(p, cost, message)}
              >
                {message}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
  if (task.t === Task.forge) {
    const blacksmithDiscount = p.boughtTiles[Tile.blacksmith] ? 2 : 0;
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
        <button onClick={() => utils.forge(p, state)}>forge {state}</button>
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
