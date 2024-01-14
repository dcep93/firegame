import { useState } from "react";
import styles from "../../../../shared/styles.module.css";
import { Buildable, Task } from "../utils/NewGame";
import utils, { store } from "../utils/utils";
import ActionsBoard from "./ActionsBoard";
import CardActions from "./CardActions";
import Player from "./Player";
import StoreBoard from "./StoreBoard";

export default function Main() {
  const [selected, updateSelected] = useState<
    [number, number, number] | undefined
  >(undefined);
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <div>
        <div className={styles.bubble}>
          <div>current: {utils.getCurrent().userName}</div>
          <div>
            {store.gameW.game.tasks.map((t, i) => (
              <div key={i}>
                <div>{Task[t.t]}</div>
                {t.d === undefined
                  ? null
                  : JSON.stringify(
                      Object.assign(
                        {},
                        null,
                        t.d,
                        t.d.buildableOptions === undefined
                          ? null
                          : {
                              buildableOptions: t.d.buildableOptions.map(
                                (b) => Buildable[b]
                              ),
                            }
                      )
                    )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <ActionsBoard />
      <div style={{ alignSelf: "flex-end" }}>
        {store.gameW.game.players
          .map(
            (_, i) =>
              store.gameW.game.players[
                (i + store.gameW.game.players.length - utils.myIndex()) %
                  store.gameW.game.players.length
              ]
          )
          .map((p, i) => (
            <Player
              key={i}
              p={p}
              updateSelected={(s: [number, number, number]) =>
                p.userId === store.me.userId &&
                (JSON.stringify(selected) === JSON.stringify(s)
                  ? updateSelected(undefined)
                  : updateSelected(s))
              }
              selected={p.userId !== store.me.userId ? undefined : selected}
            />
          ))}
      </div>
      <CardActions />
      <StoreBoard selected={selected} />
    </div>
  );
}
