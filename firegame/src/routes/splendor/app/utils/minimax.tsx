function minimax<T>(
  state: T,
  state_to_children: (s: T) => { [move: string]: T },
  heuristic: (s: T) => number,
  depth: number,
  top: number
): string[][] {
  return [];
}

export default minimax;
