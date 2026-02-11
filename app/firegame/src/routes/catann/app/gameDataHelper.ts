import { GameStateUpdateType, State } from "./gameLogic/CatannFilesEnums";

export const isObject = (value: any) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export const deepEqual = (a: any, b: any): boolean => {
  if (Object.is(a, b)) return true;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    return a.every((value, index) => deepEqual(value, b[index]));
  }
  if (isObject(a) && isObject(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => deepEqual(a[key], b[key]));
  }
  return false;
};

const buildUpdatePaths = (
  previous: any,
  current: any,
  path: string,
  updates: Record<string, any>,
) => {
  if (deepEqual(previous, current)) return;
  if (Array.isArray(previous) || Array.isArray(current)) {
    if (!Array.isArray(previous) || !Array.isArray(current)) {
      updates[path] = current;
      return;
    }
    const maxLen = Math.max(previous.length, current.length);
    for (let i = 0; i < maxLen; i++) {
      const childPath = path ? `${path}/${i}` : `${i}`;
      if (i >= current.length) {
        updates[childPath] = null;
        continue;
      }
      if (i >= previous.length) {
        updates[childPath] = current[i];
        continue;
      }
      buildUpdatePaths(previous[i], current[i], childPath, updates);
    }
    return;
  }
  if (isObject(previous) && isObject(current)) {
    const prevKeys = Object.keys(previous);
    const nextKeys = Object.keys(current);
    const keys = new Set([...prevKeys, ...nextKeys]);
    keys.forEach((key) => {
      const childPath = path ? `${path}/${key}` : key;
      if (!(key in current)) {
        updates[childPath] = null;
        return;
      }
      if (!(key in previous)) {
        updates[childPath] = current[key];
        return;
      }
      buildUpdatePaths(previous[key], current[key], childPath, updates);
    });
    return;
  }
  updates[path] = current;
};

export const buildUpdateMap = (previous: any, current: any) => {
  const updates: Record<string, any> = {};
  const safePrevious = isObject(previous) ? previous : {};
  const safeCurrent = isObject(current) ? current : {};
  buildUpdatePaths(safePrevious, safeCurrent, "", updates);
  return updates;
};

const buildDiff = (previous: any, current: any): any | undefined => {
  if (deepEqual(previous, current)) return undefined;
  if (Array.isArray(previous) || Array.isArray(current)) {
    if (!Array.isArray(previous) || !Array.isArray(current)) return current;
    return deepEqual(previous, current) ? undefined : current;
  }
  if (isObject(previous) && isObject(current)) {
    const diff: Record<string, any> = {};
    Object.keys(current).forEach((key) => {
      const childDiff = buildDiff(previous[key], current[key]);
      if (childDiff !== undefined) {
        diff[key] = childDiff;
      }
    });
    return Object.keys(diff).length > 0 ? diff : undefined;
  }
  return current;
};

export const buildGameStateUpdated = (gameData: any, previousState?: any) => {
  const gameState = gameData?.data?.payload?.gameState;
  if (!gameState) return null;
  const diff = previousState ? buildDiff(previousState, gameState) : gameState;
  if (!diff || (isObject(diff) && Object.keys(diff).length === 0)) {
    return null;
  }
  const timeLeftInState =
    gameData?.data?.payload?.timeLeftInState ??
    gameState?.currentState?.allocatedTime ??
    0;
  return {
    id: State.GameStateUpdate.toString(),
    data: {
      type: GameStateUpdateType.GameStateUpdated,
      payload: {
        diff,
        timeLeftInState,
      },
    },
  };
};
