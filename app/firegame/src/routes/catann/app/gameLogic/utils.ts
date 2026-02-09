export const addGameLogEntry = (gameState: any, entry: any) => {
  const getNextGameLogIndex = (gameLogState: Record<string, any>) => {
    const indices = Object.keys(gameLogState)
      .map((key) => Number.parseInt(key, 10))
      .filter((value) => Number.isFinite(value));
    if (indices.length === 0) return 2;
    const nextIndex = Math.max(...indices) + 1;
    return nextIndex < 2 ? 2 : nextIndex;
  };
  if (!gameState.gameLogState) {
    gameState.gameLogState = {};
  }
  const nextIndex = getNextGameLogIndex(gameState.gameLogState);
  gameState.gameLogState[String(nextIndex)] = entry;
  return nextIndex;
};

export const TEST_CHANGE_STR = "test.Controller.handleReconnect";
