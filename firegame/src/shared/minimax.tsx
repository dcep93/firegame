type ResultType = { score: number; moves: string[] };
type Params<T> = {
  heuristic: (s: T) => number;
  stateToChildren: (s: T) => { [move: string]: T };
};

function minimax<T>(state: T, depth: number, params: Params<T>): number {
  const results = minimaxHelper(state, depth, params).sort(
    (a, b) => a.score - b.score
  );
  if (true) results.reverse();
  const rval = results[0]?.score;
  const resultsStr = results
    .map((r) =>
      ([] as string[]).concat(`(${r.score.toFixed(3)})`, r.moves).join(" ")
    )
    .join("\n");
  console.log(resultsStr);
  return rval;
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
