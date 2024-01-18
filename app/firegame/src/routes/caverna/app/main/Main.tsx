import { useState } from "react";
import css from "../index.module.css";
import { Coords } from "../utils/NewGame";
import ActionsView from "./ActionsView";
import CavernsView from "./CavernsView";
import ExpeditionsAndRubiesView from "./ExpeditionsAndRubiesView";
import PlayersView from "./PlayersView";
import TaskView from "./TaskView";

export default function Main() {
  const [selected, updateSelected] = useState<Coords | undefined>(undefined);
  return (
    <div
      className={css.main}
      style={{ width: "100%", display: "flex", flexDirection: "column" }}
    >
      <TaskView />
      <ActionsView />
      <PlayersView selected={selected} updateSelected={updateSelected} />
      <ExpeditionsAndRubiesView />
      <CavernsView selected={selected} />
    </div>
  );
}

export function chunk<T>(ts: T[], num: number): T[][] {
  return ts
    .reduce(
      (prev, curr: T) => {
        if (prev[0].length === num) {
          prev.unshift([]);
        }
        prev[0].push(curr);
        return prev;
      },
      [[]] as T[][]
    )
    .reverse();
}
