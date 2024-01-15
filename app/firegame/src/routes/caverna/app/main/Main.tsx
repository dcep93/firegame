import { useState } from "react";
import utils, { store } from "../utils/utils";
import ActionsBoard from "./ActionsBoard";
import CardActions from "./CardActions";
import Player from "./Player";
import StoreBoard from "./StoreBoard";
import TaskView from "./TaskView";

export default function Main() {
  const [selected, updateSelected] = useState<
    [number, number, number] | undefined
  >(undefined);
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <TaskView />
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
