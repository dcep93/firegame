import { firebaseData } from "../FirebaseWrapper";
import {
  CornerDirection,
  EdgeDirection,
  PlayerColor,
} from "./CatannFilesEnums";

export const TEST_CHANGE_STR = "test.Controller.handleReconnect";

export const addGameLogEntry = (
  gameState: NonNullable<
    (typeof firebaseData)["GAME"]
  >["data"]["payload"]["gameState"],
  entry: NonNullable<
    (typeof firebaseData)["GAME"]
  >["data"]["payload"]["gameState"]["gameLogState"]["string"],
) => {
  if (!gameState!.gameLogState) {
    gameState!.gameLogState = {};
  }
  const indices = Object.keys(gameState!.gameLogState)
    .map((key) => Number.parseInt(key, 10))
    .filter((value) => Number.isFinite(value));
  const nextIndex = Math.max(...indices) + 1;
  gameState!.gameLogState[String(nextIndex)] = entry;
  return nextIndex;
};

export const tileEdgeStates = {
  ["0" as string]: {
    x: 1,
    y: -3,
    z: 2,
  },
  "1": {
    x: 1,
    y: -2,
    z: 1,
  },
  "2": {
    x: 0,
    y: -1,
    z: 0,
  },
  "3": {
    x: 0,
    y: -2,
    z: 2,
  },
  "4": {
    x: 0,
    y: -2,
    z: 1,
  },
  "5": {
    x: 0,
    y: -2,
    z: 0,
  },
  "6": {
    x: 0,
    y: -1,
    z: 1,
  },
  "7": {
    x: -1,
    y: 0,
    z: 0,
  },
  "8": {
    x: -1,
    y: -1,
    z: 2,
  },
  "9": {
    x: -1,
    y: -1,
    z: 1,
  },
  "10": {
    x: -1,
    y: -1,
    z: 0,
  },
  "11": {
    x: -1,
    y: 0,
    z: 1,
  },
  "12": {
    x: -2,
    y: 1,
    z: 0,
  },
  "13": {
    x: -2,
    y: 0,
    z: 2,
  },
  "14": {
    x: -2,
    y: 0,
    z: 1,
  },
  "15": {
    x: -2,
    y: 0,
    z: 0,
  },
  "16": {
    x: -1,
    y: 0,
    z: 2,
  },
  "17": {
    x: -1,
    y: 1,
    z: 1,
  },
  "18": {
    x: -2,
    y: 2,
    z: 0,
  },
  "19": {
    x: -2,
    y: 1,
    z: 2,
  },
  "20": {
    x: -2,
    y: 1,
    z: 1,
  },
  "21": {
    x: -1,
    y: 1,
    z: 2,
  },
  "22": {
    x: -1,
    y: 2,
    z: 1,
  },
  "23": {
    x: -2,
    y: 3,
    z: 0,
  },
  "24": {
    x: -2,
    y: 2,
    z: 2,
  },
  "25": {
    x: -2,
    y: 2,
    z: 1,
  },
  "26": {
    x: 0,
    y: 1,
    z: 2,
  },
  "27": {
    x: 0,
    y: 2,
    z: 1,
  },
  "28": {
    x: -1,
    y: 3,
    z: 0,
  },
  "29": {
    x: -1,
    y: 2,
    z: 2,
  },
  "30": {
    x: -1,
    y: 2,
    z: 0,
  },
  "31": {
    x: 1,
    y: 1,
    z: 2,
  },
  "32": {
    x: 1,
    y: 2,
    z: 1,
  },
  "33": {
    x: 0,
    y: 3,
    z: 0,
  },
  "34": {
    x: 0,
    y: 2,
    z: 2,
  },
  "35": {
    x: 0,
    y: 2,
    z: 0,
  },
  "36": {
    x: 2,
    y: 0,
    z: 2,
  },
  "37": {
    x: 2,
    y: 1,
    z: 1,
  },
  "38": {
    x: 1,
    y: 2,
    z: 0,
  },
  "39": {
    x: 1,
    y: 1,
    z: 1,
  },
  "40": {
    x: 1,
    y: 1,
    z: 0,
  },
  "41": {
    x: 3,
    y: -1,
    z: 2,
  },
  "42": {
    x: 3,
    y: 0,
    z: 1,
  },
  "43": {
    x: 2,
    y: 1,
    z: 0,
  },
  "44": {
    x: 2,
    y: 0,
    z: 1,
  },
  "45": {
    x: 2,
    y: 0,
    z: 0,
  },
  "46": {
    x: 3,
    y: -2,
    z: 2,
  },
  "47": {
    x: 3,
    y: -1,
    z: 1,
  },
  "48": {
    x: 2,
    y: -1,
    z: 2,
  },
  "49": {
    x: 2,
    y: -1,
    z: 1,
  },
  "50": {
    x: 2,
    y: -1,
    z: 0,
  },
  "51": {
    x: 3,
    y: -3,
    z: 2,
  },
  "52": {
    x: 3,
    y: -2,
    z: 1,
  },
  "53": {
    x: 2,
    y: -2,
    z: 2,
  },
  "54": {
    x: 2,
    y: -2,
    z: 1,
  },
  "55": {
    x: 2,
    y: -2,
    z: 0,
  },
  "56": {
    x: 2,
    y: -3,
    z: 2,
  },
  "57": {
    x: 1,
    y: -1,
    z: 0,
  },
  "58": {
    x: 1,
    y: -2,
    z: 2,
  },
  "59": {
    x: 1,
    y: -2,
    z: 0,
  },
  "60": {
    x: 1,
    y: -1,
    z: 1,
  },
  "61": {
    x: 0,
    y: 0,
    z: 0,
  },
  "62": {
    x: 0,
    y: -1,
    z: 2,
  },
  "63": {
    x: 0,
    y: 0,
    z: 1,
  },
  "64": {
    x: -1,
    y: 1,
    z: 0,
  },
  "65": {
    x: 0,
    y: 0,
    z: 2,
  },
  "66": {
    x: 0,
    y: 1,
    z: 1,
  },
  "67": {
    x: 1,
    y: 0,
    z: 2,
  },
  "68": {
    x: 0,
    y: 1,
    z: 0,
  },
  "69": {
    x: 1,
    y: 0,
    z: 1,
  },
  "70": {
    x: 1,
    y: 0,
    z: 0,
  },
  "71": {
    x: 1,
    y: -1,
    z: 2,
  },
};

export const tileCornerStates = {
  ["0" as string]: {
    x: 0,
    y: -2,
    z: 0,
  },
  "1": {
    x: 1,
    y: -3,
    z: 1,
  },
  "2": {
    x: 0,
    y: -1,
    z: 0,
  },
  "3": {
    x: 0,
    y: -2,
    z: 1,
  },
  "4": {
    x: -1,
    y: -1,
    z: 0,
  },
  "5": {
    x: 0,
    y: -3,
    z: 1,
  },
  "6": {
    x: -1,
    y: 0,
    z: 0,
  },
  "7": {
    x: -1,
    y: -1,
    z: 1,
  },
  "8": {
    x: -2,
    y: 0,
    z: 0,
  },
  "9": {
    x: -1,
    y: -2,
    z: 1,
  },
  "10": {
    x: -2,
    y: 1,
    z: 0,
  },
  "11": {
    x: -2,
    y: 0,
    z: 1,
  },
  "12": {
    x: -3,
    y: 1,
    z: 0,
  },
  "13": {
    x: -2,
    y: -1,
    z: 1,
  },
  "14": {
    x: -1,
    y: 0,
    z: 1,
  },
  "15": {
    x: -2,
    y: 2,
    z: 0,
  },
  "16": {
    x: -2,
    y: 1,
    z: 1,
  },
  "17": {
    x: -3,
    y: 2,
    z: 0,
  },
  "18": {
    x: -1,
    y: 1,
    z: 1,
  },
  "19": {
    x: -2,
    y: 3,
    z: 0,
  },
  "20": {
    x: -2,
    y: 2,
    z: 1,
  },
  "21": {
    x: -3,
    y: 3,
    z: 0,
  },
  "22": {
    x: -1,
    y: 2,
    z: 0,
  },
  "23": {
    x: 0,
    y: 1,
    z: 1,
  },
  "24": {
    x: -1,
    y: 3,
    z: 0,
  },
  "25": {
    x: -1,
    y: 2,
    z: 1,
  },
  "26": {
    x: 0,
    y: 2,
    z: 0,
  },
  "27": {
    x: 1,
    y: 1,
    z: 1,
  },
  "28": {
    x: 0,
    y: 3,
    z: 0,
  },
  "29": {
    x: 0,
    y: 2,
    z: 1,
  },
  "30": {
    x: 1,
    y: 1,
    z: 0,
  },
  "31": {
    x: 2,
    y: 0,
    z: 1,
  },
  "32": {
    x: 1,
    y: 2,
    z: 0,
  },
  "33": {
    x: 1,
    y: 0,
    z: 1,
  },
  "34": {
    x: 2,
    y: 0,
    z: 0,
  },
  "35": {
    x: 3,
    y: -1,
    z: 1,
  },
  "36": {
    x: 2,
    y: 1,
    z: 0,
  },
  "37": {
    x: 2,
    y: -1,
    z: 1,
  },
  "38": {
    x: 2,
    y: -1,
    z: 0,
  },
  "39": {
    x: 3,
    y: -2,
    z: 1,
  },
  "40": {
    x: 1,
    y: 0,
    z: 0,
  },
  "41": {
    x: 2,
    y: -2,
    z: 1,
  },
  "42": {
    x: 2,
    y: -2,
    z: 0,
  },
  "43": {
    x: 3,
    y: -3,
    z: 1,
  },
  "44": {
    x: 1,
    y: -1,
    z: 0,
  },
  "45": {
    x: 2,
    y: -3,
    z: 1,
  },
  "46": {
    x: 1,
    y: -2,
    z: 0,
  },
  "47": {
    x: 1,
    y: -2,
    z: 1,
  },
  "48": {
    x: 0,
    y: 0,
    z: 0,
  },
  "49": {
    x: 0,
    y: -1,
    z: 1,
  },
  "50": {
    x: -1,
    y: 1,
    z: 0,
  },
  "51": {
    x: 0,
    y: 0,
    z: 1,
  },
  "52": {
    x: 0,
    y: 1,
    z: 0,
  },
  "53": {
    x: 1,
    y: -1,
    z: 1,
  },
};

export const edgeEndpoints = (edgeState: {
  x: number;
  y: number;
  z: number;
}) => {
  switch (edgeState.z) {
    case EdgeDirection.NorthWest:
      return [
        { x: edgeState.x, y: edgeState.y - 1, z: CornerDirection.South },
        { x: edgeState.x, y: edgeState.y, z: CornerDirection.North },
      ];
    case EdgeDirection.West:
      return [
        { x: edgeState.x - 1, y: edgeState.y + 1, z: CornerDirection.North },
        { x: edgeState.x, y: edgeState.y - 1, z: CornerDirection.South },
      ];
    case EdgeDirection.SouthWest:
      return [
        { x: edgeState.x, y: edgeState.y, z: CornerDirection.South },
        { x: edgeState.x - 1, y: edgeState.y + 1, z: CornerDirection.North },
      ];
    default:
      return [];
  }
};

export const colorHelper = Object.values(PlayerColor)
  .filter((v) => isNaN(v as number))
  .filter((v) => v !== PlayerColor[PlayerColor.None])
  .map((v) => v as string)
  .map((v) => ({
    int: PlayerColor[v as keyof typeof PlayerColor],
    str: v[0].toLowerCase().concat(v.slice(1)),
  }));
