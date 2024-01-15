import { useState } from "react";
import BoardView from "./BoardView";
import CavernsView from "./CavernsView";
import ExpeditionsAndRubiesView from "./ExpeditionsAndRubiesView";
import PlayersView from "./PlayersView";
import TaskView from "./TaskView";

export default function Main() {
  const [selected, updateSelected] = useState<
    [number, number, number] | undefined
  >(undefined);
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <TaskView />
      <BoardView />
      <div style={{ alignSelf: "flex-end" }}>
        <PlayersView selected={selected} updateSelected={updateSelected} />
      </div>
      <ExpeditionsAndRubiesView />
      <CavernsView selected={selected} />
    </div>
  );
}
