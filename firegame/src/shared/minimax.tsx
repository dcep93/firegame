type ResultType = { score: number; moves: string[] };
type Params<T> = {
  heuristic: (s: T) => number;
  stateToChildren: (s: T) => { [move: string]: T };
};

function minimax<T>(state: T, depth: number, params: Params<T>): void {
  const results = minimaxHelper(state, depth, params)
    .map((r) => ([] as (number | string)[]).concat(r.score, r.moves))
    .sort();
  if (true) results.reverse();
  results.forEach((r) => (r[0] = `(${(r[0] as number).toFixed(3)})`));
  console.log(results.map((r) => r.join(" ")).join("\n"));
}

function minimaxHelper<T>(
  state: T,
  depth: number,
  params: Params<T>
): ResultType[] {
  return Object.entries(params.stateToChildren(state)).map(([move, child]) => {
    if (depth > 0) {
      const children = minimaxHelper(child, depth - 1, params);
      if (children.length > 0) {
        var bestChild: ResultType | null = null;
        for (let c of children) {
          if (bestChild === null || c.score > bestChild.score) {
            bestChild = c;
          }
        }
        return {
          score: bestChild!.score,
          moves: [move].concat(bestChild!.moves),
        };
      }
    }
    const result = { score: params.heuristic(child), moves: [move] };
    if (depth > 0) result.score *= Infinity;
    return result;
  });
}

export default minimax;
