type ResultType = { score: number; moves: string[] };
type Params<T> = {
  heuristic: (s: T) => number;
  stateToChildren: (s: T) => { [move: string]: T };
  maximizing: (s: T) => boolean;
};

function minimax<T>(state: T, depth: number, params: Params<T>): number {
  const results = minimaxHelper(state, depth, params);
  const rval = parseFloat(results[0]?.score?.toFixed(3));
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
  const results = Object.entries(params.stateToChildren(state))
    .map(([move, child]) => {
      if (depth > 0) {
        const bestChild = minimaxHelper(child, depth - 1, params)[0];
        if (bestChild) {
          return {
            score: bestChild.score,
            moves: [move].concat(bestChild.moves),
          };
        }
      }
      const result = { score: params.heuristic(child), moves: [move] };
      if (depth > 0) {
        result.score *= Infinity;
        result.moves.push(`(${depth})`);
      }
      return result;
    })
    .sort((a, b) => a.score - b.score);
  if (params.maximizing(state)) results.reverse();
  return results;
}

export default minimax;
