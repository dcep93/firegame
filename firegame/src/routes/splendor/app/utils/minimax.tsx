function minimax<T>(
  state: T,
  heuristic: (s: T) => number,
  state_to_children: (s: T) => { [move: string]: T },
  depth: number,
  top: number
): string[][] {
  return [];
}

export default minimax;
