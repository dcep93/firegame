import { useState } from "react";
import css from "../index.module.css";
import { Coords } from "../utils/NewGame";
import ActionsView from "./ActionsView";
import CavernsView from "./CavernsView";
import ExpeditionsAndRubiesView from "./ExpeditionsAndRubiesView";
import LogView from "./LogView";
import Photos from "./Photos";
import PlayersView from "./PlayersView";
import TaskView from "./TaskView";

// TODO images need ruby mining
// TODO skip_one pulled off fields

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
      <LogView />
      <Photos />
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
