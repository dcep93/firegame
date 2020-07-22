import minimax from "./minimax";
import { GameType } from "./NewGame";
import { store } from "./utils";

function ai(depth: number, top: number = 0): void {
  const results = minimax(
    store.gameW.game,
    state_to_children,
    heuristic,
    depth,
    top
  );
  console.log(results.map((r) => r.join(" ")).join("\n"));
}

function state_to_children(s: GameType): { [move: string]: GameType } {
  return {};
}

function heuristic(s: GameType): number {
  return 0;
}

export default ai;
